import { useRouter } from "next/dist/client/router";
import React from "react";
import { useGetUserQuery } from "../__generated__/lib/client.graphql";

const Author = () => {
  const router = useRouter();
  const userId = router.query.userId as string | undefined;
  const { data, loading, error } = useGetUserQuery({
    variables: { userId },
    fetchPolicy: "cache-only",
  });
  if (loading) return <div>로딩중..</div>;
  if (!data || error) return <div>에러..!</div>;
  return (
    <div className="comp">
      <h1 className="title">Author</h1>
      👨 {data.getUser.name}
    </div>
  );
};

export default Author;
