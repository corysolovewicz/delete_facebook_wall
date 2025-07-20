// ==UserScript==
// @name         Facebook Delete or Untag Posts (Scroll + Dynamic + Expand)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically delete or untag posts from your feed on Facebook, supports infinite scroll and expanding hidden menu items like "See X More" spans before clicking actions like "Delete post" or "Remove tag". Handles dynamic DOM changes too.
// @author       Cory Solovewicz
// @match        https://www.facebook.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const ACTION_LABEL = "Actions for this post";
    const DELETE_TEXT = "Delete post";
    const REMOVE_TAG_TEXT = "Remove tag";
    const FINAL_DELETE_LABEL = "Delete";

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function autoScrollSlowly() {
        window.scrollBy(0, 1000);
        await sleep(1000);
    }

    async function tryDeleteOrUntagOnePost() {
        const buttons = Array.from(document.querySelectorAll(`div[aria-label="${ACTION_LABEL}"]:not([data-deleted])`));

        if (buttons.length === 0) {
            console.log("No unprocessed action buttons found.");
            await autoScrollSlowly();
            return false;
        }

        const btn = buttons[0];
        btn.setAttribute("data-deleted", "true");

        try {
            btn.click();
            await sleep(1000);

            // 🔽 Expand any "See X More" dropdowns before scanning for delete/tag actions
            const seeMoreSpans = Array.from(document.querySelectorAll('span'))
                .filter(span => /^See \d{1,4} More$/.test(span.innerText));

            for (const span of seeMoreSpans) {
                try {
                    span.click();
                    console.log(`🔽 Expanded: ${span.innerText}`);
                    await sleep(500);
                } catch (e) {
                    console.warn("⚠️ Failed to click 'See More':", e);
                }
            }

            // 🔍 Look for action items
            const spans = Array.from(document.querySelectorAll('span'));
            const deletePostBtn = spans.find(s => s.innerText === DELETE_TEXT);
            const removeTagBtn = spans.find(s => s.innerText === REMOVE_TAG_TEXT);

            if (deletePostBtn) {
                deletePostBtn.click();
                await sleep(1000);

                const confirmBtns = Array.from(document.querySelectorAll(`div[aria-label="${FINAL_DELETE_LABEL}"]`));
                const finalDelete = confirmBtns.find(b => b.innerText === FINAL_DELETE_LABEL);

                if (finalDelete) {
                    finalDelete.click();
                    console.log("✅ Post deleted.");
                    await sleep(2000);
                    return true;
                }
            } else if (removeTagBtn) {
                removeTagBtn.click();
                console.log("✅ Tag removed.");
                await sleep(1500);
                return true;
            } else {
                console.log("❌ Neither delete nor remove tag option found. Dismissing modal.");
                document.dispatchEvent(new KeyboardEvent('keydown', {
                    key: "Escape",
                    code: "Escape",
                    keyCode: 27,
                    which: 27,
                    bubbles: true
                }));
                await sleep(500);
            }
        } catch (err) {
            console.warn("⚠️ Error processing a post:", err);
        }

        return false;
    }

    async function startLooping() {
        let idleCount = 0;
        while (idleCount < 10) {
            const didProcess = await tryDeleteOrUntagOnePost();
            if (!didProcess) {
                idleCount++;
                await sleep(1000);
            } else {
                idleCount = 0;
            }
        }

        console.log("🎉 Finished or no more deletable/tagged posts.");
    }

    function addUI() {
        const runBtn = document.createElement('button');
        runBtn.textContent = "🧹 Clean Posts (Delete/Untag)";
        runBtn.style.position = "fixed";
        runBtn.style.bottom = "20px";
        runBtn.style.right = "20px";
        runBtn.style.padding = "10px 15px";
        runBtn.style.zIndex = "9999";
        runBtn.style.backgroundColor = "#e53935";
        runBtn.style.color = "#fff";
        runBtn.style.border = "none";
        runBtn.style.borderRadius = "5px";
        runBtn.style.cursor = "pointer";
        runBtn.onclick = startLooping;

        document.body.appendChild(runBtn);
    }

    window.addEventListener('load', () => {
        setTimeout(addUI, 3000);
    });
})();
