// @ts-ignore
import { QueryResolvers, MutationResolvers } from "./server.graphqls";
import { ResolverContext } from "./apollo";
import { LegacyUser, User } from "../__generated__/__types__";

// 짱구 : https://upload.wikimedia.org/wikipedia/ko/thumb/4/4a/%EC%8B%A0%EC%A7%B1%EA%B5%AC.png/230px-%EC%8B%A0%EC%A7%B1%EA%B5%AC.png

const legacyUsers: LegacyUser[] = [
  { idNo: "abcde", name: "우왕😃" },
  { idNo: "cdefg", name: "좋앙😂" },
];
const users: User[] = [
  {
    id: "abcde",
    name: "오제관",
    status: "좋음",
    totalFollowers: 10,
    createdAt: new Date("2021-07-26").toISOString(),
    thumbnail:
      "https://item.kakaocdn.net/do/a1866850b14ae47d0a2fd61f409dfc057154249a3890514a43687a85e6b6cc82",
  },
  {
    id: "cdefg",
    name: "홍길동",
    status: "나쁨",
    totalFollowers: 11,
    createdAt: new Date("1999-07-01").toISOString(),
    thumbnail:
      "https://img1.daumcdn.net/thumb/C500x500.fpng/?fname=http://t1.daumcdn.net/brunch/service/user/6qYm/image/eAFjiZeA-fGh8Y327AH7oTQIsxQ.png",
  },
];

const SLEEP_TIME = 0;
const sleep = (duration: number) =>
  new Promise((resolve) => setTimeout(resolve, duration));

const Query: Required<QueryResolvers<ResolverContext>> = {
  async getUser(_parent, { userId }, _context, _info) {
    await sleep(SLEEP_TIME);
    return users.find((user) => user.id === userId);
  },
  async getUsers(_parent, { skip = 0, take = 10 }, _context, _info) {
    await sleep(SLEEP_TIME);
    return users.slice(skip, take);
  },
  async getLegacyUser(_parent, { userId }, _context, _info) {
    await sleep(SLEEP_TIME);
    return legacyUsers.find((user) => user.idNo === userId) || users[0];
  },
};

const Mutation: Required<MutationResolvers<ResolverContext>> = {
  async addFollower(_parent, { userId }, _context, _info) {
    await sleep(SLEEP_TIME);
    const user = users.find((user) => user.id === userId);
    if (user) user.totalFollowers += 1;
    return user;
  },
  async updateUserName(_parent, { userId, name }, _context, _info) {
    await sleep(SLEEP_TIME);
    const user = users.find((user) => user.id === userId);
    if (user) user.name = name;
    return user;
  },
};

export default { Query, Mutation };
