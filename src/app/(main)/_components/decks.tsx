import {db} from "@/db";
import {decks} from "@/db/schema";

import {NewDeck} from "./new-deck";

export async function Decks() {
  let decksResult = await db.select().from(decks);
  return (
    <div>
      <p>Decks</p>
      <ul className="pl-2">
        {/* Render decks here */}
        {decksResult.map((deck) => (
          <li key={deck.id}>{deck.name}</li>
        ))}
        <NewDeck />
      </ul>
    </div>
  );
}
