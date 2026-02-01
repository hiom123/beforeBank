import { motion } from "framer-motion";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import { Slider } from "@/src/components/ui/slider";
import { MarketSettings as MarketSettingsType } from "@/src/types/loan";
import { Settings2 } from "lucide-react";

interface MarketSettingsProps {
  settings: MarketSettingsType;
  onChange: (settings: MarketSettingsType) => void;
}

export function MarketSettings({ settings, onChange }: MarketSettingsProps) {
  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20">
          <Settings2 className="w-4 h-4 text-primary" />
        </div>
        <h3 className="text-lg font-semibold gradient-text">시장 설정</h3>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="stressRate" className="text-sm font-medium text-muted-foreground">
              스트레스 금리
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="stressRate"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={settings.stressRate}
                onChange={(e) =>
                  onChange({ ...settings, stressRate: parseFloat(e.target.value) || 0 })
                }
                className="w-20 h-8 text-center text-sm bg-muted/50 border-border/50 focus:glow-border-cyan"
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
          </div>
          
          <Slider
            value={[settings.stressRate]}
            onValueChange={(value) => onChange({ ...settings, stressRate: value[0] })}
            min={0}
            max={5}
            step={0.1}
            className="py-2"
          />
          
          <p className="text-xs text-muted-foreground/70">
            신규 대출 금리에 가산되어 DSR 산출에 반영됩니다
          </p>
        </div>
      </div>
    </motion.div>
  );
}