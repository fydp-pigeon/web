import { getServerUser } from '@/_lib/server/getServerUser';
import { PageHeader } from '../_components/PageHeader';
import { Avatar } from '@/_components/Avatar';
import { Card } from '@/_components/Card';

export default async function ProfilePage() {
  const user = await getServerUser();

  return (
    <>
      <PageHeader title="Profile" />
      <Card>
        <Avatar name={user.name!} src={user.image} />
        <div className="space-y-4">
          <div>
            <strong>Name: </strong>
            {user.name}
          </div>
          <div>
            <strong>Email: </strong>
            {user.email}
          </div>
        </div>
      </Card>
    </>
  );
}
