import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
  listingId?: string;
}

/**
 * @swagger
 * /favorites/{listingId}:
 *   post:
 *     summary: Add a listing to favorites
 *     description: Add a listing to favorites
 *     parameters:
 *       - in: path
 *         name: listingId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the listing to add to favorites
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

export async function POST(request: Request, { params }: { params: IParams }) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid ID");
  }

  let favoriteIds = [...(currentUser.favoriteIds || [])];

  favoriteIds.push(listingId);

  const user = await prisma.user.update({
    where: {
      id: currentUser.id,
    },
    data: {
      favoriteIds,
    },
  });

  return NextResponse.json(user);
}

/**
 * @swagger
 * /favorites/{listingId}:
 *   delete:
 *     summary: Remove a listing from favorites
 *     description: Remove a listing from favorites
 *     parameters:
 *       - in: path
 *         name: listingId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the listing to remove from favorites
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid ID");
  }

  let favoriteIds = [...(currentUser.favoriteIds || [])];

  favoriteIds = favoriteIds.filter((id) => id !== listingId);

  const user = await prisma.user.update({
    where: {
      id: currentUser.id,
    },
    data: {
      favoriteIds,
    },
  });

  return NextResponse.json(user);
}
