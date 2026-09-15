import { supabase, isSupabaseConfigured } from './supabase';

// Table name - reuse if exists, create if needed via migration
const TABLE = 'assessment_results';

/**
 * Persist the FINAL assessment result for the authenticated user.
 * Uses the exact result data already computed by the assessment engine.
 * Does NOT invent scores - caller provides real unified/result_data.
 */
export async function saveAssessmentResult({ assessmentType, educationStage, assessmentData, resultData }) {
  if (!isSupabaseConfigured) return { skipped: true, reason: 'supabase not configured' };
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { skipped: true, reason: 'not authenticated - falling back to local storage' };

    const payload = {
      user_id: user.id,
      assessment_type: assessmentType || assessmentData?.flow || 'unknown',
      education_stage: educationStage || assessmentData?.stream || null,
      assessment_data: assessmentData || {},
      result_data: resultData || {},
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from(TABLE)
      .insert({ ...payload, created_at: new Date().toISOString() })
      .select()
      .single();

    if (error) {
      // Table may not exist yet - surface cleanly for fallback
      console.warn('[assessmentResults] save failed:', error.message);
      return { error: error.message, skipped: true };
    }
    return { data };
  } catch (e) {
    console.warn('[assessmentResults] save exception:', e?.message);
    return { error: e?.message, skipped: true };
  }
}

/**
 * Fetch latest completed result for current user.
 * Returns { data: row|null, loading:false, error }
 */
export async function fetchLatestResult() {
  if (!isSupabaseConfigured) return { data: null, skipped: true };
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, skipped: true, reason: 'not authenticated' };

    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      // If table missing, treat as no data rather than hard error
      if (error.code === '42P01' || /does not exist/i.test(error.message)) {
        return { data: null, error: null, tableMissing: true };
      }
      return { data: null, error: error.message };
    }
    return { data: data || null, error: null };
  } catch (e) {
    return { data: null, error: e?.message || 'Failed to load' };
  }
}
