import { Tag } from "@/generated/prisma";
import extendedPrisma from "@/lib/prisma";
import { ActionReturn } from "@/types/types";

/**
 * Retrieves all tags associated with a specific user from the database.
 *
 * @param userId - The unique identifier of the user whose tags are to be fetched.
 *
 * @returns An object containing the operation result:
 *   - If successful, returns `{ success: true, data: tags }` where `tags` is an array of the user's tags.
 *   - If an error occurs, returns `{ success: false }`.
 */
export async function getTags(userId: string): ActionReturn<Tag[]> {
  try {
    const tags = await extendedPrisma.tag.findMany({
      where: {
        userId: userId,
      },
    });
    return { success: true, data: tags };
  } catch (error) {
    console.error("[ERROR] fetching tags : ", error);
    return { success: false };
  }
}

/**
 * Adds a new tag to the database.
 *
 * @param tag - The tag object to be added.
 *
 * @returns An object containing the operation result:
 *   - If successful, returns `{ success: true, data: tag }` where `tag` is the created tag.
 *   - If an error occurs, returns `{ success: false }`.
 */
export async function addTag(tag: Tag): ActionReturn<Tag> {
  try {
    const addedTag = await extendedPrisma.tag.create({ data: { ...tag } });
    return { success: true, data: addedTag };
  } catch (error) {
    console.error(`[ERROR] adding tag ${tag} : `, error);
    return { success: false };
  }
}
