import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
  reservationId?: string;
}

/**
 * @swagger
 * /reservations/{reservationId}:
 *   delete:
 *     summary: Cancel a reservation
 *     description: Cancel a reservation by its ID for the authenticated user
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the reservation to cancel
 *     responses:
 *       200:
 *         description: Successful cancellation
 *         content:
 *           application/json:
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (user does not own the reservation)
 *       404:
 *         description: Reservation not found
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

  const { reservationId } = params;

  if (!reservationId || typeof reservationId !== "string") {
    throw new Error("Invalid ID");
  }

  const reservation = await prisma.reservation.deleteMany({
    where: {
      id: reservationId,
      OR: [{ userId: currentUser.id }, { listing: { userId: currentUser.id } }],
    },
  });

  return NextResponse.json(reservation);
}
