import { BlockModel } from './blocks/BlockModel';

export interface PageModel {
    redirect?: string;
    blocks: BlockModel[];
}

