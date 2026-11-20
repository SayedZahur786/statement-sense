import {Workspace} from '@/components/workspace';import {demoStatement} from '@/lib/demo';
export default function Demo(){return <Workspace initial={demoStatement()} uploadsAvailable={!!process.env.DATABASE_URL}/>;}
