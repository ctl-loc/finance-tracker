import { X } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { startTransition, useEffect, useState } from "react";
import { Tag } from "@/generated/prisma";
import { useSession } from "next-auth/react";
import { addTag, getTags } from "@/actions/tags";

export default function TagsSelector({
  tagsState,
}: {
  tagsState: [Tag[], React.Dispatch<React.SetStateAction<Tag[]>>];
}) {
  const { data: session, status } = useSession();
  const [tags, setTags] = useState([] as Tag[]);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const [selectedTags, setSelectedTags] = tagsState;

  const unselectTag = (tag: Tag) => {
    setSelectedTags(
      selectedTags.filter((selected: Tag) => selected.id !== tag.id)
    );
  };

  const selectTag = (tag: Tag) => {
    if (selectedTags.some((t) => t.id === tag.id)) {
      unselectTag(tag);
    } else {
      setSelectedTags((prev) => [...prev, tag]);
    }
  };
  const createTag = async (name: string) => {
    if (name === "") return;
    const creationTag = { name: name, userId: session?.user.id } as Tag;
    const newTag = await addTag(creationTag);
    if (newTag.success && newTag.data) selectTag(newTag.data);
  };

  useEffect(
    () =>
      startTransition(async () => {
        if (status !== "authenticated") return;
        const fetchedTags = await getTags(session.user.id);
        if (fetchedTags.success && fetchedTags.data) setTags(fetchedTags.data);
      }),
    []
  );

  return (
    <div>
      {/*  list selected tags */}
      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tag: Tag) => (
          <Badge key={tag.id} variant="secondary">
            {tag.name}
            <div key={`remove-${tag.id}`} onClick={() => unselectTag(tag)}>
              <X className="ml-1 h-3 w-3 cursor-pointer" />
            </div>
          </Badge>
        ))}
      </div>
      {/* combobox */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="mt-2 w-full justify-start">
            + Add tag
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput
              placeholder="Search or create tag..."
              onValueChange={setQuery}
            />
            {/* on 'no tag found' */}
            <CommandEmpty>
              <div
                className="cursor-pointer px-2 py-2"
                onClick={() => createTag(query)}
              >
                Create &quot;{query}&quot; {/* proper quotation " " notation */}
              </div>
            </CommandEmpty>
            {/* list all registered tags */}
            <CommandGroup>
              {tags.map((tag: Tag) => (
                <CommandItem
                  key={tag.id}
                  onSelect={() => {
                    addTag(tag);
                    setOpen(false);
                  }}
                >
                  {tag.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
