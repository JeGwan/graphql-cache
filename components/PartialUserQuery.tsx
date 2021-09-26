import { useRouter } from "next/dist/client/router";

import { useGetUserOnlyNameQuery } from "../lib/client.graphql";
import Author from "./Author";

const PartialUserQuery = () => {
  const router = useRouter();
  const userId = router.query.userId as string | undefined;
  const { data, loading, error } = useGetUserOnlyNameQuery({
    variables: { userId },
  });
  if (loading) return <div>로딩중..</div>;
  if (!data || error) return <div>에러..!</div>;
  return (
    <div className="comp">
      <h1 className="title">PartialUserQuery</h1>
      <Author />
      <div>🤚 이름은 : {data.getUser.name}</div>
    </div>
  );
};

export default PartialUserQuery;
