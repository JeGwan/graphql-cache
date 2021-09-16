import { useRouter } from "next/dist/client/router";

import { useApolloClient } from "@apollo/client";

import {
  GetUserDocument,
  GetUserQuery,
} from "../__generated__/lib/client.graphql";

const UserByReadQuery = () => {
  const router = useRouter();
  const client = useApolloClient();
  const { getUser } = client.readQuery<GetUserQuery>({
    query: GetUserDocument,
    variables: {
      userId: router.query.userId,
    },
  });

  const { totalFollowers, name } = getUser;
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
