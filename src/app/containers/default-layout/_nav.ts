import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    // badge: {
    //   color: 'info',
    //   text: 'NEW'
    // }
  },
  {
    title: true,
    name: 'Components'
  },
  {
    name: 'Block',
    url: '/block',
    iconComponent: { name: 'cil-terminal' },
    children: [
      {
        name: 'Create',
        url: '/block/create',
        icon: 'cil-plus'
      },
      {
        name: 'View',
        url: '/block/list',
        icon: 'cil-list'
      },
    ]
  },
  {
    name: 'Instance',
    url: '/instance',
    iconComponent: { name: 'cil-puzzle' },
    children: [
      {
        name: 'Create',
        url: '/instance/create',
        icon: 'cil-plus'
      },
      {
        name: 'View',
        url: '/instance/list',
        icon: 'cil-list'
      },
    ]
  },
  {
    name: 'DAG Flow',
    url: '/dag',
    iconComponent: { name: 'cil-sitemap' },
    children: [
      {
        name: 'Create',
        url: '/dag/create',
        icon: 'cil-plus'
      },
      {
        name: 'View',
        url: '/dag/list',
        icon: 'cil-list'
      },
    ]
  },
  {
    name: 'Step Flow',
    url: '/step',
    icon: 'cil-grid',
    children: [
      {
        name: 'Create',
        url: '/step/create',
        icon: 'cil-plus'
      },
      {
        name: 'View',
        url: '/step/list',
        icon: 'cil-list'
      },
    ]
  },
  {
    divider: true
  },
  {
    title: true,
    name: 'Extras',
  },
  {
    name: 'Parameters',
    url: '/parameters',
    icon: 'cil-wrap-text'
  },
  {
    name: 'Icons',
    url: '/icons',
    icon: 'cil-image'
  }
];