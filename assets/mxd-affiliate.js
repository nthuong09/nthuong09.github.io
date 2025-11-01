// REPLACE WHOLE FILE: /assets/mxd-affiliate.js
(() => {
  // BASES: AccessTrade deep links for nthuong09 (base đã có sub4=oneatweb)
  const BASES = {
    shopee: "https://go.isclix.com/deep_link/6838510564673741003/4751584435713464237?sub4=oneatweb",
    tiktok: "https://go.isclix.com/deep_link/6838510564673741003/6648523843406889655?sub4=oneatweb",
    lazada: "https://go.isclix.com/deep_link/6838510564673741003/5127144557053758578?sub4=oneatweb",
  };

  const MERCHANT_FROM_HOST = (h) => {
    if (!h) return "";
    const host = h.toLowerCase();
    if (host.includes("shopee")) return "shopee";
    if (host.includes("lazada")) return "lazada";
    if (host.includes("tiktok")) return "tiktok";
    return "";
  };

  const isIsclix = (u) => {
    try { return new URL(u).hostname.endsWith("isclix.com"); } catch { return false; }
  };

  const absUrl = (href) => {
    try { return new URL(href, location.origin).href; } catch { return href || "#"; }
  };

  const pickMerchant = (meta, originAbs) => {
    const fromData = (meta.dataset.merchant || "").toLowerCase();
    if (fromData) return fromData;
    try { return MERCHANT_FROM_HOST(new URL(originAbs).hostname); } catch { return ""; }
  };

  const guessSku = (meta, card) => {
    if (meta.dataset.sku) return meta.dataset.sku;
    if (card?.dataset?.sku) return card.dataset.sku;
    const img = card?.querySelector?.('img[src*="/assets/img/products/"]');
    if (img) {
      const m = img.src.match(/\/assets\/img\/products\/([^\/]+)\.webp/i);
      if (m) return m[1];
    }
    try {
      const u = new URL(meta.getAttribute("href") || "#", location.origin);
      const segs = (u.pathname || "").split("/").filter(Boolean);
      return segs.pop() || "";
    } catch { return ""; }
  };

  const buildSubs = (meta, card, merchant, baseHasSub4) => {
    // Defaults: sub1=sku, sub2=merchant, sub3=tool, sub4 chỉ thêm nếu base KHÔNG có sẵn sub4
    const dflt = {
      sub1: guessSku(meta, card),
      sub2: merchant || (meta.dataset.merchant || "").toLowerCase(),
      sub3: "tool",
      // Nếu base không có sub4, dùng 'nthuong09' làm nhãn site; nếu base đã có sub4 thì bỏ qua
      ...(baseHasSub4 ? {} : { sub4: "nthuong09" }),
    };
    const subs = { ...dflt };
    // Cho phép override qua data-sub*
    ["sub1", "sub2", "sub3", "sub4"].forEach((k) => {
      const v = meta.dataset[k];
      if (v) subs[k] = v;
    });
    return subs;
  };

  const deepLinkFor = (meta) => {
    const card = meta.closest?.(".product-card") || null;
    let origin = meta.getAttribute("href") || "#";
    const originAbs = absUrl(origin);
    const merchant = pickMerchant(meta, originAbs);
    const base = BASES[merchant];

    // Nếu không có base hoặc link đã là isclix thì giữ nguyên
    if (!base || isIsclix(originAbs)) return originAbs;

    const baseHasSub4 = /\bsub4=/.test(base);
    const glue = base.includes("?") ? "&" : "?";
    const subs = buildSubs(meta, card, merchant, baseHasSub4);

    let url = `${base}${glue}url=${encodeURIComponent(originAbs)}`;
    Object.entries(subs).forEach(([k, v]) => {
      if (v != null && v !== "") url += `&${k}=${encodeURIComponent(String(v))}`;
    });
    return url;
  };

  const sendGA = (meta) => {
    try {
      if (typeof window.gtag === "function") {
        window.gtag("event", "aff_click", {
          event_category: "affiliate",
          event_label: meta.dataset.merchant || "",
          value: Number(meta.dataset.price) || undefined,
          merchant: meta.dataset.merchant || "",
          sku: meta.dataset.sku || "",
        });
      }
    } catch {}
  };

  const resolveMeta = (card) => {
    return (
      card.querySelector("a.product-meta") ||
      card.querySelector("a[data-merchant]") ||
      card.querySelector("a[href]")
    );
  };

  const rewriteCard = (card) => {
    const meta = resolveMeta(card);
    if (!meta) return;
    const finalUrl = deepLinkFor(meta);
    card.querySelectorAll("a.buy").forEach((a) => {
      if (a.dataset.origin === "keep") return;
      a.href = finalUrl;
      a.rel = "nofollow noopener noreferrer";
    });
  };

  const rewriteAll = () => document.querySelectorAll(".product-card").forEach(rewriteCard);

  document.addEventListener("DOMContentLoaded", () => {
    rewriteAll();

    document.addEventListener("click", (ev) => {
      const btn = ev.target.closest("a.buy");
      if (!btn || btn.dataset.origin === "keep") return;
      const card = btn.closest(".product-card");
      const meta = card && resolveMeta(card);
      if (!meta) return;
      const finalUrl = deepLinkFor(meta);
      btn.href = finalUrl;
      sendGA(meta);
      ev.preventDefault();
      window.location.assign(finalUrl);
    });

    new MutationObserver((muts) => {
      muts.forEach((m) =>
        m.addedNodes &&
        m.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches?.(".product-card")) rewriteCard(node);
          node.querySelectorAll?.(".product-card").forEach(rewriteCard);
        })
      );
    }).observe(document.body, { childList: true, subtree: true });
  });
})();
