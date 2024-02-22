import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
  listingId?: string;
}

/**
 * @swagger
 * /listings/{listingId}:
 *   delete:
 *     summary: Delete a listing
 *     description: Delete a listing owned by the authenticated user
 *     parameters:
 *       - in: path
 *         name: listingId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the listing to delete
 *     responses:
 *       200:
 *         description: Successful deletion
 *         content:
 *           application/json:
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (user does not own the listing)
 *       404:
 *         description: Listing not found
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

  if (!listingId || typeof listingId !== 'string') {
    throw new Error('Invalid ID');
  }

  const listing = await prisma.listing.deleteMany({
    where: {
      id: listingId,
      userId: currentUser.id
    }
  });

  return NextResponse.json(listing);
}