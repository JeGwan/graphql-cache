import { GetServerSideProps } from "next";
import UserByUseQuery from "../components/UserByUserQuery";
import UserByReadQuery from "../components/UserByReadQuery";
import UserList from "../components/UserList";

import { useAddFollowerMutation, useGetUserQuery } from "../lib/client.graphql";
import PartialUserQuery from "../components/PartialUserQuery";
import Button from "../components/Button";
import CashOnlyToDoesnExist from "../components/CashOnlyToDoesnExist";
import LegacyUserByReadHook from "../components/LegacyUserByQueryHook";

interface PageProps {
  userId?: string;
}

const Index = ({ userId }: PageProps) => {
  const { data, loading, error } = useGetUserQuery({ variables: { userId } });
  console.log(`Index`, { userId, data, loading, error });
  const [addFollwers] = useAddFollowerMutation();
  const handleAddFollower = (userId: string) => {
    addFollwers({
      variables: { userId },
      // update: (cache, mutationResult) => {
      //   const { data } = mutationResult;
      //   if (!data) return; // Cancel updating name in cache if no data is returned from mutation.
      //   // Read the data from our cache for this query.
      //   const { viewer } = cache.readQuery({
      //     query: ViewerDocument,
      //   }) as ViewerQuery;
      //   const newViewer = { ...viewer };
      //   // Add our comment from the mutation to the end.
      //   newViewer.name = data.updateName.name;
      //   // Write our data back to the cache.
      //   cache.writeQuery({
      //     query: ViewerDocument,
      //     data: { viewer: newViewer },
      //   });
      // },
    });
  };
  if (loading) return <div>로딩중..</div>;
  if (!data || error) return <div>에러..!</div>;
  return (
    <div className="comp">
      <h1 className="title">Index</h1>
      <ul>
        {Object.keys(data.getUser).map((key) => (
          <li key={key}>
            {key} : {data.getUser[key]}
          </li>
        ))}
      </ul>
      <CashOnlyToDoesnExist />
      <Button value="change" onClick={() => handleAddFollower(data.getUser.id)}>
        {data.getUser.name} 팔로!
      </Button>
      <UserByUseQuery />
      <UserByReadQuery />
      <UserList />
      <PartialUserQuery />
      <LegacyUserByReadHook />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  query,
}) => {
  let userId = query.userId as string | undefined;
  if (!userId) userId = "abcde";
  return {
    props: { userId },
  };
};

export default Index;
