import { codeToHtml } from 'shiki';
import { Caption } from './caption';

export const Snippet = async ({ children, caption = null }) => {
  const lang = children.props.className.replace('language-', '');
  const code = children.props.children;
  const out = await codeToHtml(code, {
    lang,
    theme: 'github-dark',
  });

  return (
    <div className="my-6">
      <div dangerouslySetInnerHTML={{ __html: out }} />
      {caption != null ? <Caption>{caption}</Caption> : null}
    </div>
  );
};
