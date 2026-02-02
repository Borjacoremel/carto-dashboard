// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import { memo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Store from '@mui/icons-material/Store';
import Map from '@mui/icons-material/Map';
import type { LayerConfig, LayerStyle } from '../../types/map';
import { ColorPicker } from '../controls/ColorPicker';
import { SliderControl } from '../controls/SliderControl';
import { SelectControl } from '../controls/SelectControl';
interface LayerControlsProps {
  layer: LayerConfig;
  onStyleChange: (updates: Partial<LayerStyle>) => void;
  onToggleVisibility: () => void;
}
export const LayerControls = memo(function LayerControls({
  layer,
  onStyleChange,
  onToggleVisibility
}: LayerControlsProps) {
  if (stryMutAct_9fa48("198")) {
    {}
  } else {
    stryCov_9fa48("198");
    const [expanded, setExpanded] = useState(stryMutAct_9fa48("199") ? false : (stryCov_9fa48("199"), true));
    const {
      style
    } = layer;
    const LayerIcon = (stryMutAct_9fa48("202") ? layer.type !== 'point' : stryMutAct_9fa48("201") ? false : stryMutAct_9fa48("200") ? true : (stryCov_9fa48("200", "201", "202"), layer.type === 'point')) ? Store : Map;
    return <Box sx={stryMutAct_9fa48("204") ? {} : (stryCov_9fa48("204"), {
      bgcolor: 'rgba(255,255,255,0.03)',
      borderRadius: 1,
      p: 1.5,
      border: '1px solid',
      borderColor: style.visible ? 'primary.main' : 'transparent',
      opacity: style.visible ? 1 : 0.6,
      transition: 'all 0.2s'
    })}>
      {/* Header */}
      <Box sx={stryMutAct_9fa48("210") ? {} : (stryCov_9fa48("210"), {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      })}>
        <Box component="button" onClick={stryMutAct_9fa48("214") ? () => undefined : (stryCov_9fa48("214"), () => setExpanded(stryMutAct_9fa48("215") ? expanded : (stryCov_9fa48("215"), !expanded)))} sx={stryMutAct_9fa48("216") ? {} : (stryCov_9fa48("216"), {
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flex: 1,
          textAlign: 'left',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          p: 0,
          color: 'inherit'
        })}>
          <LayerIcon sx={stryMutAct_9fa48("224") ? {} : (stryCov_9fa48("224"), {
            fontSize: 18,
            color: 'primary.main'
          })} />
          <Typography variant="body2" sx={stryMutAct_9fa48("226") ? {} : (stryCov_9fa48("226"), {
            fontWeight: 500,
            flex: 1
          })} noWrap>
            {layer.name}
          </Typography>
          {expanded ? <ExpandLess sx={stryMutAct_9fa48("227") ? {} : (stryCov_9fa48("227"), {
            fontSize: 18,
            color: 'text.secondary'
          })} /> : <ExpandMore sx={stryMutAct_9fa48("229") ? {} : (stryCov_9fa48("229"), {
            fontSize: 18,
            color: 'text.secondary'
          })} />}
        </Box>
        <IconButton size="small" onClick={onToggleVisibility} sx={stryMutAct_9fa48("231") ? {} : (stryCov_9fa48("231"), {
          ml: 1
        })}>
          {style.visible ? <Visibility sx={stryMutAct_9fa48("232") ? {} : (stryCov_9fa48("232"), {
            fontSize: 18
          })} /> : <VisibilityOff sx={stryMutAct_9fa48("233") ? {} : (stryCov_9fa48("233"), {
            fontSize: 18,
            color: 'text.secondary'
          })} />}
        </IconButton>
      </Box>

      {/* Controls */}
      {stryMutAct_9fa48("237") ? expanded && style.visible || <Box sx={{
        mt: 2,
        '& > *:not(:last-child)': {
          mb: 2
        },
        animation: 'fadeIn 0.2s ease-out',
        '@keyframes fadeIn': {
          from: {
            opacity: 0,
            transform: 'translateY(-8px)'
          },
          to: {
            opacity: 1,
            transform: 'translateY(0)'
          }
        }
      }}>
          {/* Fill Color */}
          <ColorPicker label="Fill Color" color={style.fillColor} onChange={fillColor => onStyleChange({
          fillColor
        })} />

          {/* Color by Column */}
          <SelectControl label="Color by Value" value={style.colorByColumn} options={layer.colorByOptions.map(col => ({
          value: col,
          label: col.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        }))} onChange={colorByColumn => onStyleChange({
          colorByColumn
        })} placeholder="None (solid color)" />

          {/* Opacity */}
          <SliderControl label="Opacity" value={style.opacity} min={0.1} max={1} step={0.1} onChange={opacity => onStyleChange({
          opacity
        })} formatValue={v => `${Math.round(v * 100)}%`} />

          {/* Outline Color */}
          <ColorPicker label="Outline Color" color={style.outlineColor} onChange={outlineColor => onStyleChange({
          outlineColor
        })} />

          {/* Outline Width */}
          <SliderControl label="Outline Width" value={style.outlineWidth} min={0} max={5} step={0.5} onChange={outlineWidth => onStyleChange({
          outlineWidth
        })} formatValue={v => `${v}px`} />

          {/* Radius (only for point layers) */}
          {layer.type === 'point' && <SliderControl label="Point Radius" value={style.radius} min={2} max={20} step={1} onChange={radius => onStyleChange({
          radius
        })} formatValue={v => `${v}px`} />}
        </Box> : stryMutAct_9fa48("236") ? false : stryMutAct_9fa48("235") ? true : (stryCov_9fa48("235", "236", "237"), (stryMutAct_9fa48("239") ? expanded || style.visible : stryMutAct_9fa48("238") ? true : (stryCov_9fa48("238", "239"), expanded && style.visible)) && <Box sx={stryMutAct_9fa48("240") ? {} : (stryCov_9fa48("240"), {
        mt: 2,
        '& > *:not(:last-child)': stryMutAct_9fa48("241") ? {} : (stryCov_9fa48("241"), {
          mb: 2
        }),
        animation: 'fadeIn 0.2s ease-out',
        '@keyframes fadeIn': stryMutAct_9fa48("243") ? {} : (stryCov_9fa48("243"), {
          from: stryMutAct_9fa48("244") ? {} : (stryCov_9fa48("244"), {
            opacity: 0,
            transform: 'translateY(-8px)'
          }),
          to: stryMutAct_9fa48("246") ? {} : (stryCov_9fa48("246"), {
            opacity: 1,
            transform: 'translateY(0)'
          })
        })
      })}>
          {/* Fill Color */}
          <ColorPicker label="Fill Color" color={style.fillColor} onChange={stryMutAct_9fa48("248") ? () => undefined : (stryCov_9fa48("248"), fillColor => onStyleChange(stryMutAct_9fa48("249") ? {} : (stryCov_9fa48("249"), {
          fillColor
        })))} />

          {/* Color by Column */}
          <SelectControl label="Color by Value" value={style.colorByColumn} options={layer.colorByOptions.map(stryMutAct_9fa48("250") ? () => undefined : (stryCov_9fa48("250"), col => stryMutAct_9fa48("251") ? {} : (stryCov_9fa48("251"), {
          value: col,
          label: col.replace(/_/g, ' ').replace(stryMutAct_9fa48("253") ? /\b\W/g : (stryCov_9fa48("253"), /\b\w/g), stryMutAct_9fa48("254") ? () => undefined : (stryCov_9fa48("254"), l => stryMutAct_9fa48("255") ? l.toLowerCase() : (stryCov_9fa48("255"), l.toUpperCase())))
        })))} onChange={stryMutAct_9fa48("256") ? () => undefined : (stryCov_9fa48("256"), colorByColumn => onStyleChange(stryMutAct_9fa48("257") ? {} : (stryCov_9fa48("257"), {
          colorByColumn
        })))} placeholder="None (solid color)" />

          {/* Opacity */}
          <SliderControl label="Opacity" value={style.opacity} min={0.1} max={1} step={0.1} onChange={stryMutAct_9fa48("258") ? () => undefined : (stryCov_9fa48("258"), opacity => onStyleChange(stryMutAct_9fa48("259") ? {} : (stryCov_9fa48("259"), {
          opacity
        })))} formatValue={stryMutAct_9fa48("260") ? () => undefined : (stryCov_9fa48("260"), v => `${Math.round(stryMutAct_9fa48("262") ? v / 100 : (stryCov_9fa48("262"), v * 100))}%`)} />

          {/* Outline Color */}
          <ColorPicker label="Outline Color" color={style.outlineColor} onChange={stryMutAct_9fa48("263") ? () => undefined : (stryCov_9fa48("263"), outlineColor => onStyleChange(stryMutAct_9fa48("264") ? {} : (stryCov_9fa48("264"), {
          outlineColor
        })))} />

          {/* Outline Width */}
          <SliderControl label="Outline Width" value={style.outlineWidth} min={0} max={5} step={0.5} onChange={stryMutAct_9fa48("265") ? () => undefined : (stryCov_9fa48("265"), outlineWidth => onStyleChange(stryMutAct_9fa48("266") ? {} : (stryCov_9fa48("266"), {
          outlineWidth
        })))} formatValue={stryMutAct_9fa48("267") ? () => undefined : (stryCov_9fa48("267"), v => `${v}px`)} />

          {/* Radius (only for point layers) */}
          {stryMutAct_9fa48("271") ? layer.type === 'point' || <SliderControl label="Point Radius" value={style.radius} min={2} max={20} step={1} onChange={radius => onStyleChange({
          radius
        })} formatValue={v => `${v}px`} /> : stryMutAct_9fa48("270") ? false : stryMutAct_9fa48("269") ? true : (stryCov_9fa48("269", "270", "271"), (stryMutAct_9fa48("273") ? layer.type !== 'point' : stryMutAct_9fa48("272") ? true : (stryCov_9fa48("272", "273"), layer.type === 'point')) && <SliderControl label="Point Radius" value={style.radius} min={2} max={20} step={1} onChange={stryMutAct_9fa48("275") ? () => undefined : (stryCov_9fa48("275"), radius => onStyleChange(stryMutAct_9fa48("276") ? {} : (stryCov_9fa48("276"), {
          radius
        })))} formatValue={stryMutAct_9fa48("277") ? () => undefined : (stryCov_9fa48("277"), v => `${v}px`)} />)}
        </Box>)}
    </Box>;
  }
});