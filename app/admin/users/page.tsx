import { createSupabaseServerClient } from '@/lib/supabase/server';
import { UsersTable } from '@/components/admin/UsersTable';
import type { UserWithRole } from '@/types/user';

export const metadata = {
  title: 'User Directory — Admin | Luxe Estate',
  description: 'Manage user access and roles for your properties.',
};

export default async function AdminUsersPage() {
  const supabase = await createSupabaseServerClient();

  // Query user_roles
  const { data: roles, error: rolesError } = await supabase
    .from('user_roles')
    .select('user_id, role, created_at, email, display_name, avatar_url')
    .order('created_at', { ascending: false });

  if (rolesError) {
    console.error('[AdminUsersPage] Error fetching roles:', rolesError);
  }

  // Fetch auth user metadata via custom RPC as supplementary enrichment
  const { data: authUsers } = await supabase.rpc('get_users_with_metadata');

  const enrichedUsers: UserWithRole[] = (roles ?? []).map((r) => {
    const meta = (authUsers as Array<{id: string; email: string; display_name: string; avatar_url: string | null}> | null)
      ?.find((a) => a.id === r.user_id);
    return {
      id: r.user_id,
      email: r.email || meta?.email || '',
      display_name: r.display_name || meta?.display_name || '',
      avatar_url: r.avatar_url || meta?.avatar_url || null,
      role: r.role,
      created_at: r.created_at,
    };
  });

  return <UsersTable initialUsers={enrichedUsers} />;
}

