import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { UserRole } from '@/types/user';

const VALID_ROLES: UserRole[] = ['admin', 'user'];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: targetUserId } = await params;
  const supabase = await createSupabaseServerClient();

  // 1. Verify the caller is authenticated
  const {
    data: { user: caller },
  } = await supabase.auth.getUser();

  if (!caller) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Verify the caller is an admin
  const { data: callerRole } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', caller.id)
    .maybeSingle();

  if (!callerRole || callerRole.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // 3. Parse and validate the new role
  let body: { role: UserRole };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { role } = body;
  if (!role || !VALID_ROLES.includes(role)) {
    return NextResponse.json(
      { error: `Invalid role. Must be one of: ${VALID_ROLES.join(', ')}` },
      { status: 400 }
    );
  }

  // 4. Update the role
  const { error } = await supabase
    .from('user_roles')
    .update({ role })
    .eq('user_id', targetUserId);

  if (error) {
    console.error('[PATCH /api/admin/users/[id]/role] Supabase error:', error);
    return NextResponse.json({ error: 'Failed to update role' }, { status: 500 });
  }

  return NextResponse.json({ success: true, userId: targetUserId, role });
}
