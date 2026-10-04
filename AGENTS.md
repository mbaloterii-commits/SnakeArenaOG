<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->

- Game rules (24h limit, lives, score caps, admin changes) are enforced in SECURITY DEFINER database functions, not the client — so players cannot cheat by editing the browser.
- Player identity = auth account; nick is set once at signup by a trigger and never editable — prevents playing on new nicks.
