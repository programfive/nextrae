import { createUserAction, listUsers, updateUserAction } from "@/actions/users";
import { UsersPage } from "@/components/app/users/UsersPage";

export default async function Page() {
  const { data: users, stats } = await listUsers();

  return (
    <UsersPage
      users={users}
      stats={stats}
      createUserAction={createUserAction}
      updateUserAction={updateUserAction}
    />
  );
}
