const cleanTags = text => text.replace(/<\/?[^>]+(>|$)/g, '');

export const shareToFacebook = url => {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    url
  )}`;
};

export const shareToTwitter = (url, title, desc) => {
  const cleanDesc = cleanTags(desc);
  return `https://twitter.com/intent/tweet?url=${encodeURIComponent(
    url
  )}&amp;text=${encodeURIComponent(title)}%3A%20${encodeURIComponent(
    cleanDesc
  )}`;
};

export const shareToLinkedin = (url, title, desc) => {
  const cleanDesc = cleanTags(desc);
  return `https://www.linkedin.com/shareArticle?mini=true&amp;url=${encodeURIComponent(
    url
  )}&amp;title=${encodeURIComponent(title)}&amp;summary=${encodeURIComponent(
    cleanDesc
  )}&amp;source=`;
};

export const shareToMail = (url, title, desc) => {
  const cleanDesc = cleanTags(desc);
  return `mailto:?subject=${encodeURIComponent(
    title
  )}%20&amp;body=${encodeURIComponent(url)}%0A%0A${encodeURIComponent(
    cleanDesc
  )}`;
};
