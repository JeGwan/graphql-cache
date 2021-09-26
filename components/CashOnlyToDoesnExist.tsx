import { useGetUserQuery } from "../__generated__/lib/client.graphql";

const CashOnlyToNotExist = () => {
  const { data, loading, error } = useGetUserQuery({
    fetchPolicy: "cache-only",
    variables: { userId: "22222" },
  });
  if (loading) return <div>로딩중..</div>;
  if (!data || error) return <div>에러..!</div>;
  const { name, totalFollowers } = data.getUser;
  return (
    <div className="comp">
      <h1 className="title">CashOnlyToDoesnExist</h1>
      <div>
        ❤️ {name}님의 팔로워 👉 {totalFollowers}
      </div>
    </div>
  );
};

export default CashOnlyToNotExist;
