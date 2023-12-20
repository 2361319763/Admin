import { DataNode } from 'antd/es/tree';

export function formatTreeData(arrayList: any): DataNode[] {
  const treeSelectData: DataNode[] = arrayList.map((item: any) => {
    const node: DataNode = {
      id: item.id,
      title: item.label,
      key: `${item.id}`,
      value: item.id,
    } as DataNode;
    if (item.children) {
      node.children = formatTreeData(item.children);
    }
    return node;
  });
  return treeSelectData;
}