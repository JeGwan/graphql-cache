import { useApolloClient } from "@apollo/client";
import { useRouter } from "next/dist/client/router";

import {
  GetLegacyUserDocument,
  GetLegacyUserQuery,
} from "../__generated__/lib/client.graphql";

const LegacyUserByReadQuery = () => {
  const router = useRouter();
  const userId = router.query.userId as string | undefined;
  const client = useApolloClient();
  const data = client.readQuery<GetLegacyUserQuery>({
    query: GetLegacyUserDocument,
    variables: {
      userId,
    },
  });
  if (!data?.getLegacyUser) return <div>캐싱중...</div>;
  const { idNo, name } = data.getLegacyUser;
  return (
    <div className="comp">
      <h1 className="title">LegacyUserByReadQuery</h1>
      <div>
        idNo: {idNo} / name: {name}
      </div>
    </div>
  );
};

export default LegacyUserByReadQuery;
