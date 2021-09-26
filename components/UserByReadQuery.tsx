import { useRouter } from "next/dist/client/router";

import { useApolloClient } from "@apollo/client";

import {
  GetUserDocument,
  GetUserQuery,
} from "../__generated__/lib/client.graphql";

const UserByReadQuery = () => {
  const router = useRouter();
  const client = useApolloClient();
  // 얘는 cache-only나 다름읎듬.. 캐쉬 레이어에 없으믄 에러남!
  const data = client.readQuery<GetUserQuery>({
    query: GetUserDocument,
    variables: {
      userId: router.query.userId,
    },
  });
  if (!data?.getUser) return null;
  const { totalFollowers, name } = data.getUser;
  return (
    <div className="comp">
      <h1 className="title">UserByReadQuery</h1>
      <div>
        ❤️ {name}님의 팔로워 👉 {totalFollowers}
      </div>
    </div>
  );
};

export default UserByReadQuery;
