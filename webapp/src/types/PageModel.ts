import { BlockModel } from './BlockModel';

export interface PageModel {
    redirect?: string;
    blocks: BlockModel[];
}

