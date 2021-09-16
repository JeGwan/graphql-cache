import { useGetUsersQuery } from "../lib/client.graphql";
import UserItem from "./UserItem";

const UserList = () => {
  const { data, loading, error } = useGetUsersQuery({
    fetchPolicy: "cache-first",
  });
  console.log(`UserList`, { data, loading, error });
  if (loading) return <div>로딩중..</div>;
  if (!data || error) return <div>에러..!</div>;
  return (
    <div className="comp">
      <h1 className="title">UserList</h1>
      {data.getUsers.map((user) => (
        <UserItem key={user.id} user={user} />
      ))}
    </div>
  );
};

export default UserList;
