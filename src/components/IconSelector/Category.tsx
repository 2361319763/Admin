import * as React from 'react';
import CopyableIcon from './CopyableIcon';
import type { CategoriesKeys } from './fields';
import type { ThemeType } from './index';
import styles from './style.module.less';

interface CategoryProps {
  title: CategoriesKeys;
  icons: string[];
  theme: ThemeType;
  newIcons: string[];
  onSelect: (type: string, name: string) => any;
}

const Category: React.FC<CategoryProps> = (props) => {
  const { icons, title, newIcons, theme } = props;
  const [justCopied, setJustCopied] = React.useState<string | null>(null);
  const copyId = React.useRef<NodeJS.Timeout | null>(null);
  const onSelect = React.useCallback((type: string, text: string) => {
    const { onSelect } = props;
    if (onSelect) {
      onSelect(type, text);
    }
    setJustCopied(type);
    copyId.current = setTimeout(() => {
      setJustCopied(null);
    }, 2000);
  }, []);
  React.useEffect(
    () => () => {
      if (copyId.current) {
        clearTimeout(copyId.current);
      }
    },
    [],
  );

  return (
    <div>
      <h4>信息</h4>
      <ul className={styles.anticonsList}>
        {icons.map((name) => (
          <CopyableIcon
            key={name}
            name={name}
            theme={theme}
            isNew={newIcons.includes(name)}
            justCopied={justCopied}
            onSelect={onSelect}
          />
        ))}
      </ul>
    </div>
  );
};

export default Category;
