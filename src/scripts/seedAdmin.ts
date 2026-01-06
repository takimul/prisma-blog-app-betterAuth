import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/auth";

async function seedAdmin() {
  try {
    console.log("*****admin seeding started***");
    const adminData = {
      name: "Admin",
      email: "admin@admin.com",
      role: UserRole.ADMIN,
      password: "admin1234",
    };
    console.log("*****checking user exist or not***");
    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });
    if (existingUser) {
      throw new Error("user already exist in db");
    }

    const signUpAdmin = await fetch(
      "http://localhost:3000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Origin": "http://localhost:3000",
        },
        body: JSON.stringify(adminData),
      }
    );
    console.log("STATUS:", signUpAdmin.status);
    console.log("OK:", signUpAdmin.ok);
    console.log("BODY:", await signUpAdmin.text());
    console.log("*****creating admin***");
    if (signUpAdmin.ok) {
      console.log("admin created");
      await prisma.user.update({
        where: {
          email: adminData.email,
        },
        data: {
          emailVerified: true,
        },
      });
    }
    console.log("success");
  } catch (error) {
    console.log(error);
  }
}

seedAdmin();
