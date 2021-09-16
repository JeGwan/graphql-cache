import { useGetLegacyUserQuery } from "../__generated__/lib/client.graphql";

const LegacyUserByReadHook = () => {
  const { data, loading, error } = useGetLegacyUserQuery({
    variables: { userId: "32" },
  });
  if (loading) return <div>로딩중</div>;
  if (!data || error) return <div>에러..!</div>;
  return (
    <div className="comp">
      <h1 className="title">LegacyUserByReadHook</h1>
      <div>
        idNo: {data?.getLegacyUser?.idNo} / name: {data?.getLegacyUser?.name}
      </div>
    </div>
  );
};

export default LegacyUserByReadHook;
