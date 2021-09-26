import { GetServerSideProps } from "next";

import Button from "../../../components/Button";
import PartialUserQuery from "../../../components/PartialUserQuery";
import UserByReadQuery from "../../../components/UserByReadQuery";
import UserByUseQuery from "../../../components/UserByUserQuery";
import {
  useAddFollowerMutation,
  useGetUserQuery,
} from "../../../lib/client.graphql";

interface PageProps {
  userId?: string;
}

const Index = ({ userId }: PageProps) => {
  const { data, loading, error } = useGetUserQuery({ variables: { userId } });
  const [addFollowers] = useAddFollowerMutation();
  const handleAddFollower = (userId: string) => {
    addFollowers({ variables: { userId } });
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
      <Button value="change" onClick={() => handleAddFollower(data.getUser.id)}>
        {data.getUser.name} 팔로!
      </Button>
      <UserByUseQuery />
      <UserByReadQuery />
      <PartialUserQuery />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  params,
}) => {
  return {
    props: { userId: params.userId as string },
  };
};

export default Index;
