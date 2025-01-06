import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Datos de prueba para desarrollo
// prettier-ignore
const data = [
  { username: "user1", email: "user1@example.com", name: "Alice", paternalLastName: "Smith", maternalLastName: "Johnson", password: "$argon2id$v=19$m=19456,t=2,p=1$NOcdlQ3W2BakMYiloiC8gQ$8TNbNx1M0zhYif0iZTSLWqFkKWOYK7BepIpxx8uycqE", userType: "USER" },
  { username: "user2", email: "user2@example.com", name: "Bob", paternalLastName: "Brown", maternalLastName: "Davis", password: "$argon2id$v=19$m=19456,t=2,p=1$NOcdlQ3W2BakMYiloiC8gQ$8TNbNx1M0zhYif0iZTSLWqFkKWOYK7BepIpxx8uycqE", userType: "USER" },
  { username: "user3", email: "user3@example.com", name: "Charlie", paternalLastName: "Garcia", maternalLastName: "Martinez", password: "$argon2id$v=19$m=19456,t=2,p=1$NOcdlQ3W2BakMYiloiC8gQ$8TNbNx1M0zhYif0iZTSLWqFkKWOYK7BepIpxx8uycqE", userType: "USER" },
  { username: "admin1", email: "admin1@example.com", name: "Admin", paternalLastName: "User", maternalLastName: "Administrator", password: "$argon2id$v=19$m=19456,t=2,p=1$NOcdlQ3W2BakMYiloiC8gQ$8TNbNx1M0zhYif0iZTSLWqFkKWOYK7BepIpxx8uycqE", userType: "ADMIN" },
  { username: "user4", email: "user4@example.com", name: "Daniel", paternalLastName: "Wilson", maternalLastName: "Taylor", password: "$argon2id$v=19$m=19456,t=2,p=1$NOcdlQ3W2BakMYiloiC8gQ$8TNbNx1M0zhYif0iZTSLWqFkKWOYK7BepIpxx8uycqE", userType: "USER" },
  { username: "user5", email: "user5@example.com", name: "Ella", paternalLastName: "Clark", maternalLastName: "Lee", password: "$argon2id$v=19$m=19456,t=2,p=1$NOcdlQ3W2BakMYiloiC8gQ$8TNbNx1M0zhYif0iZTSLWqFkKWOYK7BepIpxx8uycqE", userType: "USER" },
  { username: "user6", email: "user6@example.com", name: "Fiona", paternalLastName: "Walker", maternalLastName: "Harris", password: "$argon2id$v=19$m=19456,t=2,p=1$NOcdlQ3W2BakMYiloiC8gQ$8TNbNx1M0zhYif0iZTSLWqFkKWOYK7BepIpxx8uycqE", userType: "USER" },
  { username: "user7", email: "user7@example.com", name: "George", paternalLastName: "Young", maternalLastName: "King", password: "$argon2id$v=19$m=19456,t=2,p=1$NOcdlQ3W2BakMYiloiC8gQ$8TNbNx1M0zhYif0iZTSLWqFkKWOYK7BepIpxx8uycqE", userType: "USER" },
  { username: "user8", email: "user8@example.com", name: "Hannah", paternalLastName: "Scott", maternalLastName: "Green", password: "$argon2id$v=19$m=19456,t=2,p=1$NOcdlQ3W2BakMYiloiC8gQ$8TNbNx1M0zhYif0iZTSLWqFkKWOYK7BepIpxx8uycqE", userType: "USER" },
  { username: "user9", email: "user9@example.com", name: "Ian", paternalLastName: "Adams", maternalLastName: "Baker", password: "$argon2id$v=19$m=19456,t=2,p=1$NOcdlQ3W2BakMYiloiC8gQ$8TNbNx1M0zhYif0iZTSLWqFkKWOYK7BepIpxx8uycqE", userType: "USER" },
  { username: "user10", email: "user10@example.com", name: "Jessica", paternalLastName: "Campbell", maternalLastName: "Parker", password: "$argon2id$v=19$m=19456,t=2,p=1$NOcdlQ3W2BakMYiloiC8gQ$8TNbNx1M0zhYif0iZTSLWqFkKWOYK7BepIpxx8uycqE", userType: "USER" },
  { username: "user11", email: "user11@example.com", name: "Kyle", paternalLastName: "Evans", maternalLastName: "Collins", password: "$argon2id$v=19$m=19456,t=2,p=1$NOcdlQ3W2BakMYiloiC8gQ$8TNbNx1M0zhYif0iZTSLWqFkKWOYK7BepIpxx8uycqE", userType: "USER" },
  { username: "user12", email: "user12@example.com", name: "Liam", paternalLastName: "Edwards", maternalLastName: "Stewart", password: "$argon2id$v=19$m=19456,t=2,p=1$NOcdlQ3W2BakMYiloiC8gQ$8TNbNx1M0zhYif0iZTSLWqFkKWOYK7BepIpxx8uycqE", userType: "USER" },
  { username: "user13", email: "user13@example.com", name: "Mia", paternalLastName: "Flores", maternalLastName: "Sanders", password: "$argon2id$v=19$m=19456,t=2,p=1$NOcdlQ3W2BakMYiloiC8gQ$8TNbNx1M0zhYif0iZTSLWqFkKWOYK7BepIpxx8uycqE", userType: "USER" },
  { username: "user14", email: "user14@example.com", name: "Noah", paternalLastName: "Gray", maternalLastName: "Peterson", password: "$argon2id$v=19$m=19456,t=2,p=1$NOcdlQ3W2BakMYiloiC8gQ$8TNbNx1M0zhYif0iZTSLWqFkKWOYK7BepIpxx8uycqE", userType: "USER" },
  { username: "user15", email: "user15@example.com", name: "Olivia", paternalLastName: "Hall", maternalLastName: "Morales", password: "$argon2id$v=19$m=19456,t=2,p=1$NOcdlQ3W2BakMYiloiC8gQ$8TNbNx1M0zhYif0iZTSLWqFkKWOYK7BepIpxx8uycqE", userType: "USER" },
  { username: "user16", email: "user16@example.com", name: "Paul", paternalLastName: "Hernandez", maternalLastName: "Rogers", password: "$argon2id$v=19$m=19456,t=2,p=1$NOcdlQ3W2BakMYiloiC8gQ$8TNbNx1M0zhYif0iZTSLWqFkKWOYK7BepIpxx8uycqE", userType: "USER" },
  { username: "user17", email: "user17@example.com", name: "Quinn", paternalLastName: "Mitchell", maternalLastName: "Reed", password: "$argon2id$v=19$m=19456,t=2,p=1$NOcdlQ3W2BakMYiloiC8gQ$8TNbNx1M0zhYif0iZTSLWqFkKWOYK7BepIpxx8uycqE", userType: "USER" },
  { username: "user18", email: "user18@example.com", name: "Ruby", paternalLastName: "Perez", maternalLastName: "Cook", password: "$argon2id$v=19$m=19456,t=2,p=1$NOcdlQ3W2BakMYiloiC8gQ$8TNbNx1M0zhYif0iZTSLWqFkKWOYK7BepIpxx8uycqE", userType: "USER" },
  { username: "user19", email: "user19@example.com", name: "Sophia", paternalLastName: "Roberts", maternalLastName: "Bell", password: "$argon2id$v=19$m=19456,t=2,p=1$NOcdlQ3W2BakMYiloiC8gQ$8TNbNx1M0zhYif0iZTSLWqFkKWOYK7BepIpxx8uycqE", userType: "USER" },
  { username: "user20", email: "user20@example.com", name: "Thomas", paternalLastName: "Ross", maternalLastName: "Murphy", password: "$argon2id$v=19$m=19456,t=2,p=1$NOcdlQ3W2BakMYiloiC8gQ$8TNbNx1M0zhYif0iZTSLWqFkKWOYK7BepIpxx8uycqE", userType: "USER" },
  { username: "user21", email: "user21@example.com", name: "Uma", paternalLastName: "Watson", maternalLastName: "Rivera", password: "$argon2id$v=19$m=19456,t=2,p=1$NOcdlQ3W2BakMYiloiC8gQ$8TNbNx1M0zhYif0iZTSLWqFkKWOYK7BepIpxx8uycqE", userType: "USER" },
  { username: "user22", email: "user22@example.com", name: "Victor", paternalLastName: "Torres", maternalLastName: "Coleman", password: "$argon2id$v=19$m=19456,t=2,p=1$NOcdlQ3W2BakMYiloiC8gQ$8TNbNx1M0zhYif0iZTSLWqFkKWOYK7BepIpxx8uycqE", userType: "USER" },
  { username: "user23", email: "user23@example.com", name: "Wendy", paternalLastName: "Morgan", maternalLastName: "Griffin", password: "$argon2id$v=19$m=19456,t=2,p=1$NOcdlQ3W2BakMYiloiC8gQ$8TNbNx1M0zhYif0iZTSLWqFkKWOYK7BepIpxx8uycqE", userType: "USER" },
  { username: "user24", email: "user24@example.com", name: "Xavier", paternalLastName: "Cox", maternalLastName: "Bailey", password: "$argon2id$v=19$m=19456,t=2,p=1$NOcdlQ3W2BakMYiloiC8gQ$8TNbNx1M0zhYif0iZTSLWqFkKWOYK7BepIpxx8uycqE", userType: "USER" },
  { username: "user25", email: "user25@example.com", name: "Yvonne", paternalLastName: "Ward", maternalLastName: "Kelly", password: "$argon2id$v=19$m=19456,t=2,p=1$NOcdlQ3W2BakMYiloiC8gQ$8TNbNx1M0zhYif0iZTSLWqFkKWOYK7BepIpxx8uycqE", userType: "USER" },
  { username: "user26", email: "user26@example.com", name: "Zach", paternalLastName: "Foster", maternalLastName: "Sandoval", password: "$argon2id$v=19$m=19456,t=2,p=1$NOcdlQ3W2BakMYiloiC8gQ$8TNbNx1M0zhYif0iZTSLWqFkKWOYK7BepIpxx8uycqE", userType: "USER" },
  { username: "user27", email: "user27@example.com", name: "Aiden", paternalLastName: "Butler", maternalLastName: "Pearson", password: "$argon2id$v=19$m=19456,t=2,p=1$NOcdlQ3W2BakMYiloiC8gQ$8TNbNx1M0zhYif0iZTSLWqFkKWOYK7BepIpxx8uycqE", userType: "USER" },
  { username: "user28", email: "user28@example.com", name: "Brianna", paternalLastName: "Chapman", maternalLastName: "Fisher", password: "$argon2id$v=19$m=19456,t=2,p=1$NOcdlQ3W2BakMYiloiC8gQ$8TNbNx1M0zhYif0iZTSLWqFkKWOYK7BepIpxx8uycqE", userType: "USER" },
  { username: "user29", email: "user29@example.com", name: "Caleb", paternalLastName: "Sullivan", maternalLastName: "Gill", password: "$argon2id$v=19$m=19456,t=2,p=1$NOcdlQ3W2BakMYiloiC8gQ$8TNbNx1M0zhYif0iZTSLWqFkKWOYK7BepIpxx8uycqE", userType: "USER" },
  { username: "user30", email: "user30@example.com", name: "Diana", paternalLastName: "Hart", maternalLastName: "Fuller", password: "$argon2id$v=19$m=19456,t=2,p=1$NOcdlQ3W2BakMYiloiC8gQ$8TNbNx1M0zhYif0iZTSLWqFkKWOYK7BepIpxx8uycqE", userType: "USER" }
] as any;

async function main() {
  await prisma.user.createMany({ data, skipDuplicates: true });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
