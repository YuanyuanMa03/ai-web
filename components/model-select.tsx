"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import ModelLogo from "@/components/model-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { ModelInfo } from "@/lib/config";
import { MODEL_STORAGE_KEY } from "@/lib/utils";

const ModelList = ({
  models,
  setOpen,
  setSelectedModel,
}: {
  models: ModelInfo[];
  setOpen: (open: boolean) => void;
  setSelectedModel: (models: ModelInfo) => void;
}) => (
  <Command>
    <CommandInput placeholder="搜索模型..." />
    <CommandList>
      <CommandEmpty>没有找到模型</CommandEmpty>
      <CommandGroup>
        {models.map((model) => (
          <CommandItem
            key={model.id}
            value={model.id}
            onSelect={(value) => {
              setSelectedModel(models.find((m) => m.id === value) ?? models[0]);
              setOpen(false);
            }}
          >
            <ModelLogo brand={model.brand} />
            {model.name}
            {model.vision && (
              <Badge variant="outline" className="ml-auto">
                识图
              </Badge>
            )}
          </CommandItem>
        ))}
      </CommandGroup>
    </CommandList>
  </Command>
);

function ComboBoxResponsive({
  models,
  selectedModel,
  setSelectedModel,
}: {
  models: ModelInfo[];
  selectedModel?: ModelInfo;
  setSelectedModel: (model: ModelInfo) => void;
}) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    setSelectedModel(
      models.find(
        (item) => item.id === localStorage.getItem(MODEL_STORAGE_KEY),
      ) ?? models[0],
    );
  }, [models, setSelectedModel]);

  useEffect(() => {
    if (selectedModel) {
      localStorage.setItem(MODEL_STORAGE_KEY, selectedModel.id);
    }
  }, [selectedModel]);

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {selectedModel && (
            <Button variant="ghost">
              <ModelLogo brand={selectedModel.brand} />
              {selectedModel.name}
              <ChevronDown />
            </Button>
          )}
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <ModelList
            setOpen={setOpen}
            setSelectedModel={setSelectedModel}
            models={models}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {selectedModel && (
          <Button variant="ghost">
            <ModelLogo brand={selectedModel.brand} />
            {selectedModel.name}
            <ChevronDown />
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerTitle></DrawerTitle>
        <div className="mt-4 border-t">
          <ModelList
            setOpen={setOpen}
            setSelectedModel={setSelectedModel}
            models={models}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

const ModelSelect = ({
  models,
  selectedModel,
  setSelectedModel,
}: {
  models: ModelInfo[];
  selectedModel?: ModelInfo;
  setSelectedModel: (model: ModelInfo) => void;
}) => {
  return (
    <ComboBoxResponsive
      models={models}
      selectedModel={selectedModel}
      setSelectedModel={setSelectedModel}
    ></ComboBoxResponsive>
  );
};

export default ModelSelect;
