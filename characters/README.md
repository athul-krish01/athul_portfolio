# Mascot source sheets

Raw 3x3 sprite sheets as generated, one folder per character. These are the
*sources* — they are not served. The files the site loads are the aligned
atlases in `public/mascots/`, built from these.

Do not point the `<Mascot />` component at these PNGs directly. Each cell is
drawn independently with no shared registration, so the body slides between
directions (27px horizontally, 12px vertically at the size the Hero renders it)
and the bust ends in a hard square cut.

Rebuild the atlases after changing a source sheet:

```sh
MASCOT_ROOT="$PWD" python3 ~/.claude/skills/page-mascot/scripts/build.py athul --anchor body
MASCOT_ROOT="$PWD" python3 ~/.claude/skills/page-mascot/scripts/verify.py athul
```

`--anchor body` pins each cell on the lower body, so the base stays put while
the head turns; the other anchors (`face`, `head`, `shoulders`, `content`) let
the head drag the body around. The build also bakes in the bottom fade that
dissolves the bust into the page.

`verify.py` should report a 0.00px shift — that is how far the body moves when
a click swaps the directions atlas for the reactions one.
