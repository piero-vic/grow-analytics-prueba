export type User = {
  id: number;
  username: string;
  email: string;
  userType: "USER" | "ADMIN";
  name: string;
  paternalLastName: string;
  maternalLastName: string;
};

export type UserProperty = keyof User;

type GetUsersResponse = {
  results: User[];
  totalCount: number;
};

export const getUsers = async (
  page: number = 1,
  size: number = 10,
): Promise<GetUsersResponse> => {
  const res = await fetch(
    `http://localhost:3000/users?page=${page}&size=${size}`,
  );
  const body = (await res.json()) as GetUsersResponse;
  return body;
};

export const updateUser = async (user: User): Promise<boolean> => {
  const res = await fetch(`http://localhost:3000/users/${user.id}`, {
    method: "PUT",
    body: JSON.stringify(user),
    headers: new Headers({ "content-type": "application/json" }),
  });

  return res.ok;
};

export const deleteUser = async (id: number): Promise<boolean> => {
  const res = await fetch(`http://localhost:3000/users/${id}`, {
    method: "DELETE",
  });

  return res.ok;
};
