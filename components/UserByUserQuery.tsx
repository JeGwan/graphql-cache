import { useRouter } from "next/dist/client/router";
import React from "react";
import { useGetUserQuery } from "../__generated__/lib/client.graphql";
import Author from "./Author";

const UserByUseQuery = () => {
  const router = useRouter();
  const userId = router.query.userId as string | undefined;
  const { data, loading, error } = useGetUserQuery({
    variables: { userId },
  });
  if (loading) return <div>로딩중..</div>;
  if (!data || error) return <div>에러..!</div>;
  const { name, totalFollowers } = data.getUser;
  return (
    <div className="comp">
      <h1 className="title">UserByUserQuery</h1>
      <Author />
      <div>
        ❤️ {name}님의 팔로워 👉 {totalFollowers}
      </div>
    </div>
  );
};

export default UserByUseQuery;
