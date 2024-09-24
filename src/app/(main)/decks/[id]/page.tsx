import * as Dialog from "@radix-ui/react-dialog";
import {eq} from "drizzle-orm";
import {XIcon} from "lucide-react";
import {revalidatePath} from "next/cache";

import {db} from "@/db";
import {decks, flashCards} from "@/db/schema";

export default async function DeckPage(props: {
  params: {id: string};
}) {
  let results = await db
    .select({
      deckId: decks.id,
      deckName: decks.name,
      flashCard: flashCards,
    })
    .from(flashCards)
    .innerJoin(decks, eq(decks.id, parseInt(props.params.id, 10)));

  // .where(eq(decks.name, props.params.name))
  return (
    <div>
      <h1>Deck Page {props.params.id}</h1>
      <div>
        <ul className="flex flex-wrap gap-2">
          {results.map((result) => (
            <li
              key={result.flashCard.id}
              className="flex flex-col gap-2 rounded-md border p-2"
            >
              <p>{result.flashCard.question}</p>
            </li>
          ))}
        </ul>
        <CreateNewFlashCardDialog
          deckId={parseInt(props.params.id, 10)}
        />
      </div>
    </div>
  );
}

async function createFlashCard(data: FormData) {
  "use server";
  let {front, back, deckid} = Object.fromEntries(data.entries());
  if (
    typeof front !== "string" ||
    typeof back !== "string" ||
    typeof deckid !== "string"
  ) {
    throw new Error("Invalid input");
  }
  console.log({deckid, front, back});
  await db.insert(flashCards).values({
    deckId: parseInt(deckid, 10),
    question: front,
    answer: back,
  });

  revalidatePath(`/decks/${deckid}`);
}

function CreateNewFlashCardDialog({deckId}: {deckId: number}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button>New card</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-gray-900/40 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow">
          <Dialog.Title className="m-0 text-[17px] font-medium">
            <div className="flex">
              <p>New flash card</p>
            </div>
          </Dialog.Title>
          <Dialog.Description className="mb-5 mt-[10px] text-[15px] leading-normal">
            Create a new flash card
          </Dialog.Description>
          <form action={createFlashCard}>
            <input type="hidden" name="deckid" value={deckId} />
            <fieldset className="mb-[15px] flex flex-col gap-5 bg-red-300">
              <div className="flex items-center gap-20 bg-blue-200">
                <p className="basis-10">Front</p>
                <div className="flex-1">
                  <textarea className="w-full" name="front" />
                </div>
              </div>
              <div className="flex items-center gap-20 bg-blue-200">
                <p className="basis-10">Back</p>
                <div className="flex-1">
                  <textarea className="w-full" name="back" />
                </div>
              </div>
            </fieldset>
            <div className="mt-[25px] flex justify-end">
              <button type="submit">Save changes</button>
            </div>
          </form>
          <Dialog.Close asChild>
            <button
              className=" absolute right-[10px] top-[10px] inline-flex size-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <XIcon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
