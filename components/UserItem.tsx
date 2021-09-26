import css from "./UserItem.module.css";
import { HTMLAttributes, useEffect, useState } from "react";

import { User } from "../__generated__/__types__";
import {
  useAddFollowerMutation,
  useUpdateUserNameMutation,
} from "../lib/client.graphql";
import Button from "./Button";

interface Props extends HTMLAttributes<HTMLDivElement> {
  user: User;
}
const UserItem = ({ user }: Props) => {
  const [name, setName] = useState("");
  const [writeMode, setWriteMode] = useState(false);
  const [updateUserName] = useUpdateUserNameMutation();
  useEffect(() => {
    setName(user.name);
  }, [writeMode]);

  const [addFollowers] = useAddFollowerMutation();
  const handleFollow = () => {
    addFollowers({
      variables: { userId: user.id },
    });
  };
  return (
    <div className="comp">
      <h1 className="title">UserItem</h1>
      <div style={{ display: "flex" }}>
        <div className={css.thumbnail}>
          <img src={user.thumbnail} alt={user.name} />
        </div>
        <div style={{ marginLeft: 20 }}>
          <div>아이디 : {user.id} </div>
          <div>
            {writeMode === false ? (
              <>이름 : {user.name}</>
            ) : (
              <>
                이름 :{" "}
                <input value={name} onChange={(e) => setName(e.target.value)} />
              </>
            )}
            <Button
              onClick={() => {
                if (writeMode) {
                  updateUserName({ variables: { name, userId: user.id } });
                }
                setWriteMode(!writeMode);
              }}
            >
              수정
            </Button>
          </div>
          <div>상태 : {user.status}</div>
          <div>
            팔로워 : {user.totalFollowers}{" "}
            <Button onClick={handleFollow}>팔로잉</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserItem;
