# lesspass-helper

An offline webUI to create and generate JSON from your password's profile from LessPass.

## How to use?

You can only use this software if you're using [LessPass](https://github.com/lesspass/lesspass) as you password manager.

1. Download/clone LessPass Pure: `git clone https://github.com/lesspass/lesspass.git` and go to the tag **9.1.9** or [https://github.com/lesspass/lesspass/archive/refs/tags/9.1.9.zip](https://github.com/lesspass/lesspass/archive/refs/tags/9.1.9.zip)
2. Copie the file from `packages/lesspass-pure/dist/index.html` to `packages/lesspass-pure/index.html`
3. Update it using this **sed** command: `sed -i 's/="\//="dist\//g' 'packages/lesspass-pure/index.html'`
4. Start the webUI in standalone in your internet browser (drag & drop in your browser the index.html file contained in `packages/lesspass-pure`, and you should see in the adress something like `file:///C:/[FOLDER]/lesspass/packagespackages/lesspass-pure/index.html#/`)
5. Remember this link `file:///C:/[FOLDER]/lesspass/packages/pure/index.html#/` (you can close the tab)
6. Download/clone this repositorie: `git clone https://github.com/Kcchouette/LessPass-Helper.git` or [https://github.com/Kcchouette/lesspass-helper/archive/master.zip](https://github.com/Kcchouette/LessPass-Helper/archive/master.zip)
7. Start the webUI in standalone in your internet browser (drag & drop in your browser, and you should see in the adress something like `file:///C:/[FOLDER]/LessPass-Helper/index.html`)
8. Indicate the link from the part `3.` WITHOUT the *`index.html#/`* part and the JSON file you have (or nothing if you have nothing)
9. Finish! You can add new setting by clicking "New Setting" Button and fill all the input :)

## External Ressources

`css/bulma.min.css` come from [Bulma](https://bulma.io/) v1.0.1<br>
