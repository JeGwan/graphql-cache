import { useRouter } from "next/dist/client/router";
import { useGetLegacyUserQuery } from "../__generated__/lib/client.graphql";

const LegacyUserByQueryHook = () => {
  const router = useRouter();
  const userId = router.query.userId as string | undefined;
  const { data, loading, error } = useGetLegacyUserQuery({
    variables: { userId },
  });
  if (loading) return <div>로딩중</div>;
  if (!data || error) return <div>에러..!</div>;
  return (
    <div className="comp">
      <h1 className="title">LegacyUserByQueryHook</h1>
      <div>
        idNo: {data?.getLegacyUser?.idNo} / name: {data?.getLegacyUser?.name}
      </div>
    </div>
  );
};

export default LegacyUserByQueryHook;
