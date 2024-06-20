import { MouseEventHandler } from "react";
import { User } from "../types/room";

type UserListProps = {
  users: User[];
  username: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

const UserList = (props: UserListProps) => {
  return (
    <div className="flex-1">
      <ul className="m-0 h-72 list-none overflow-y-auto rounded-lg border border-gray-300 bg-gray-50 p-2">
        {props.users.map((user) => {
          return (
            <li
              key={user.id}
              className="mb-2 flex items-center justify-between"
            >
              <span>{user.username}</span>
              <button
                className="ml-2 cursor-pointer rounded border-none px-2 py-1 text-white"
                disabled={user.username !== props.username}
                onClick={props.onClick}
              >
                {user.micOn ? "🔊" : "🔇"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default UserList;
