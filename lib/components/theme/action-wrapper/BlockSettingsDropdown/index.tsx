import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { changeTypeItems } from '../constants';
import type { BlockType } from '@/lib';
import { Check, ChevronRight, Repeat2 } from 'lucide-react/icons';

type Props = {
  blockType?: string;
  level?: number;
  onChangeType?: (type: BlockType) => void;
  actionDropdownIcon: React.FC<{ className?: string }>;
};

export const BlockSettingsDropdown: React.FC<Props> = ({
  blockType,
  actionDropdownIcon: DropdownIcon,
  level,
  onChangeType,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="re:px-1 re:py-1.5 re:rounded re:bg-transparent re:border-none re:hover:bg-[rgba(255,255,255,0.055)] re:flex re:justify-center re:items-center re:grow-0 re:shrink-0 re:cursor-pointer re:focus-visible:border-none re:focus-visible:outline-none">
          <DropdownIcon className="re:w-[14px] re:h-[14px]" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="left"
        align="center"
        className="re:py-2 re:px-1 re:rounded-[10px] re:bg-[#252525] re:text-sm re:text-[#FFFFFFCF] re:backdrop-filter-none re:max-w-[calc(100vw-24px)] re:shadow-[0_0_0_1px_rgb(48,48,46),0_14px_28px_-6px_rgba(0,0,0,0.2),0_2px_4px_-1px_rgba(0,0,0,0.12)] re:overflow-hidden re:w-[265px] re:h-full re:max-h-[70vh]"
      >
        <DropdownMenuLabel className="re:px-2 re:mt-1.5 re:mb-2 re:text-[rgba(255,255,255,0.46)] re:text-xs re:font-medium leading-[120%]">
          {level ? `${blockType} ${level}` : blockType}
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="re:flex re:gap-2 re:items-center re:min-h-7 re:px-2 re:hover:bg-[rgba(255,255,255,0.055)] re:rounded-md re:focus-visible:border-none re:focus-visible:outline-none">
              <div className="re:flex re:justify-center re:items-center re:grow-0 re:shrink-0 min-h-7">
                <Repeat2 className="re:w-5 re:h-5 text-[rgba(255,255,255,0.81)]" />
              </div>
              <div className="re:flex-[1_1_auto]">Turn into</div>
              <div className="re:flex re:justify-center re:items-center re:grow-0 re:shrink-0 min-h-7">
                <ChevronRight className="re:w-4 re:h-4 text-[rgba(255,255,255,0.46)]" />
              </div>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="re:p-1 re:rounded-[10px] re:bg-[#252525] re:text-sm re:text-[#FFFFFFCF] re:backdrop-filter-none re:max-w-[calc(100vw-24px)] re:shadow-[0_0_0_1px_rgb(48,48,46),0_14px_28px_-6px_rgba(0,0,0,0.2),0_2px_4px_-1px_rgba(0,0,0,0.12)] re:overflow-hidden re:h-full re:max-h-[70vh] re:min-w-[180px] re:w-[220px]">
                {changeTypeItems.map(({ type, label, icon: Type }) => (
                  <DropdownMenuItem
                    key={type}
                    onClick={() => onChangeType?.(type as any)}
                    className="re:flex re:gap-2 re:items-center re:px-2 re:text-sm re:rounded-md re:hover:bg-[rgba(255,255,255,0.055)] re:min-h-7 re:w-full re:focus-visible:border-none re:focus-visible:outline-none"
                  >
                    <div className="re:shrink-0 re:grow-0 re:flex re:justify-center re:items-center re:w-5 re:h-5">
                      <Type />
                    </div>
                    <div className="re:flex-[1_1_auto]">{label}</div>
                    {blockType === label && (
                      <div className="re:shrink-0 re:grow-0 re:flex re:justify-center re:items-center re:w-5 re:h-5">
                        <Check className="re:w-4 re:h-4 text-[rgba(255,255,255,0.81)]" />
                      </div>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
