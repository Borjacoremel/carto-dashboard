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
import { HexColorPicker, HexColorInput } from 'react-colorful';
import { useState, useCallback, useId } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Popover from '@mui/material/Popover';
interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}
const PRESET_COLORS = stryMutAct_9fa48("0") ? [] : (stryCov_9fa48("0"), [stryMutAct_9fa48("1") ? {} : (stryCov_9fa48("1"), {
  hex: '#FFFFFF',
  name: 'White'
}), stryMutAct_9fa48("4") ? {} : (stryCov_9fa48("4"), {
  hex: '#36B37E',
  name: 'Green'
}), stryMutAct_9fa48("7") ? {} : (stryCov_9fa48("7"), {
  hex: '#FF8B00',
  name: 'Orange'
}), stryMutAct_9fa48("10") ? {} : (stryCov_9fa48("10"), {
  hex: '#9B59B6',
  name: 'Purple'
}), stryMutAct_9fa48("13") ? {} : (stryCov_9fa48("13"), {
  hex: '#E74C3C',
  name: 'Red'
})]);
export function ColorPicker({
  color,
  onChange,
  label
}: ColorPickerProps) {
  if (stryMutAct_9fa48("16")) {
    {}
  } else {
    stryCov_9fa48("16");
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const labelId = useId();
    const popoverId = useId();
    const handleChange = useCallback((newColor: string) => {
      if (stryMutAct_9fa48("17")) {
        {}
      } else {
        stryCov_9fa48("17");
        onChange(newColor);
      }
    }, stryMutAct_9fa48("18") ? [] : (stryCov_9fa48("18"), [onChange]));
    const open = Boolean(anchorEl);
    return <Box sx={stryMutAct_9fa48("19") ? {} : (stryCov_9fa48("19"), {
      '& > *:not(:last-child)': stryMutAct_9fa48("20") ? {} : (stryCov_9fa48("20"), {
        mb: 0.75
      })
    })}>
      {stryMutAct_9fa48("23") ? label || <Typography component="label" id={labelId} variant="caption" sx={{
        display: 'block',
        mb: 0.5,
        color: 'text.secondary',
        fontWeight: 500,
        textTransform: 'uppercase',
        fontSize: '0.625rem',
        letterSpacing: '0.05em'
      }}>
          {label}
        </Typography> : stryMutAct_9fa48("22") ? false : stryMutAct_9fa48("21") ? true : (stryCov_9fa48("21", "22", "23"), label && <Typography component="label" id={labelId} variant="caption" sx={stryMutAct_9fa48("24") ? {} : (stryCov_9fa48("24"), {
        display: 'block',
        mb: 0.5,
        color: 'text.secondary',
        fontWeight: 500,
        textTransform: 'uppercase',
        fontSize: '0.625rem',
        letterSpacing: '0.05em'
      })}>
          {label}
        </Typography>)}
      <Box component="button" type="button" onClick={stryMutAct_9fa48("30") ? () => undefined : (stryCov_9fa48("30"), e => setAnchorEl(e.currentTarget))} aria-labelledby={label ? labelId : undefined} aria-label={label ? undefined : `Select color, current: ${color}`} aria-describedby={open ? popoverId : undefined} aria-expanded={open} aria-haspopup="dialog" sx={stryMutAct_9fa48("32") ? {} : (stryCov_9fa48("32"), {
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        width: '100%',
        px: 1.5,
        py: 1,
        borderRadius: 1,
        border: '2px solid transparent',
        cursor: 'pointer',
        background: 'rgba(255,255,255,0.05)',
        transition: 'all 0.2s',
        '&:hover': stryMutAct_9fa48("40") ? {} : (stryCov_9fa48("40"), {
          background: 'rgba(255,255,255,0.1)'
        }),
        '&:focus-visible': stryMutAct_9fa48("42") ? {} : (stryCov_9fa48("42"), {
          outline: 'none',
          borderColor: 'primary.main',
          background: 'rgba(255,255,255,0.1)'
        })
      })}>
        <Box aria-hidden="true" sx={stryMutAct_9fa48("46") ? {} : (stryCov_9fa48("46"), {
          width: 20,
          height: 20,
          borderRadius: 0.5,
          border: '2px solid',
          borderColor: 'rgba(255,255,255,0.3)',
          bgcolor: color,
          // Checkerboard pattern for transparency indication
          backgroundImage: `linear-gradient(45deg, #808080 25%, transparent 25%), 
                              linear-gradient(-45deg, #808080 25%, transparent 25%), 
                              linear-gradient(45deg, transparent 75%, #808080 75%), 
                              linear-gradient(-45deg, transparent 75%, #808080 75%)`,
          backgroundSize: '8px 8px',
          backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
          position: 'relative',
          '&::after': stryMutAct_9fa48("53") ? {} : (stryCov_9fa48("53"), {
            content: '""',
            position: 'absolute',
            inset: 0,
            bgcolor: color,
            borderRadius: 'inherit'
          })
        })} />
        <Typography variant="body2" sx={stryMutAct_9fa48("57") ? {} : (stryCov_9fa48("57"), {
          fontFamily: 'monospace',
          textTransform: 'uppercase',
          color: 'text.primary',
          fontWeight: 500
        })}>
          {color}
        </Typography>
      </Box>
      <Popover id={popoverId} open={open} anchorEl={anchorEl} onClose={stryMutAct_9fa48("61") ? () => undefined : (stryCov_9fa48("61"), () => setAnchorEl(null))} anchorOrigin={stryMutAct_9fa48("62") ? {} : (stryCov_9fa48("62"), {
        vertical: 'bottom',
        horizontal: 'left'
      })} transformOrigin={stryMutAct_9fa48("65") ? {} : (stryCov_9fa48("65"), {
        vertical: 'top',
        horizontal: 'left'
      })} slotProps={stryMutAct_9fa48("68") ? {} : (stryCov_9fa48("68"), {
        paper: stryMutAct_9fa48("69") ? {} : (stryCov_9fa48("69"), {
          sx: stryMutAct_9fa48("70") ? {} : (stryCov_9fa48("70"), {
            p: 1.5,
            width: 220
          }),
          role: 'dialog',
          'aria-label': `${stryMutAct_9fa48("75") ? label && 'Color' : stryMutAct_9fa48("74") ? false : stryMutAct_9fa48("73") ? true : (stryCov_9fa48("73", "74", "75"), label || 'Color')} picker`
        })
      })}>
        <Box sx={stryMutAct_9fa48("77") ? {} : (stryCov_9fa48("77"), {
          '& .react-colorful': stryMutAct_9fa48("78") ? {} : (stryCov_9fa48("78"), {
            width: '100%',
            height: 150
          }),
          '& .react-colorful__saturation': stryMutAct_9fa48("80") ? {} : (stryCov_9fa48("80"), {
            borderRadius: '4px 4px 0 0'
          }),
          '& .react-colorful__hue': stryMutAct_9fa48("82") ? {} : (stryCov_9fa48("82"), {
            height: 12,
            borderRadius: '0 0 4px 4px'
          }),
          '& .react-colorful__pointer': stryMutAct_9fa48("84") ? {} : (stryCov_9fa48("84"), {
            width: 16,
            height: 16
          })
        })}>
          <HexColorPicker color={color} onChange={handleChange} />
        </Box>

        {/* Accessible hex input */}
        <Box sx={stryMutAct_9fa48("85") ? {} : (stryCov_9fa48("85"), {
          mt: 1.5
        })}>
          <Typography component="label" htmlFor={`${popoverId}-hex-input`} variant="caption" sx={stryMutAct_9fa48("87") ? {} : (stryCov_9fa48("87"), {
            display: 'block',
            mb: 0.5,
            color: 'text.secondary',
            fontSize: '0.625rem',
            textTransform: 'uppercase'
          })}>
            Hex Value
          </Typography>
          <HexColorInput id={`${popoverId}-hex-input`} color={color} onChange={handleChange} prefixed style={stryMutAct_9fa48("93") ? {} : (stryCov_9fa48("93"), {
            width: '100%',
            padding: '8px 12px',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '4px',
            background: 'rgba(255,255,255,0.05)',
            color: 'inherit',
            fontFamily: 'monospace',
            fontSize: '14px',
            textTransform: 'uppercase'
          })} />
        </Box>

        {/* Preset colors with proper labels */}
        <Box sx={stryMutAct_9fa48("103") ? {} : (stryCov_9fa48("103"), {
          mt: 1.5
        })}>
          <Typography component="span" variant="caption" sx={stryMutAct_9fa48("104") ? {} : (stryCov_9fa48("104"), {
            display: 'block',
            mb: 0.5,
            color: 'text.secondary',
            fontSize: '0.625rem',
            textTransform: 'uppercase'
          })}>
            Presets
          </Typography>
          <Box sx={stryMutAct_9fa48("109") ? {} : (stryCov_9fa48("109"), {
            display: 'flex',
            gap: 0.5
          })} role="group" aria-label="Preset colors">
            {PRESET_COLORS.map(stryMutAct_9fa48("111") ? () => undefined : (stryCov_9fa48("111"), preset => <Box key={preset.hex} component="button" type="button" onClick={stryMutAct_9fa48("112") ? () => undefined : (stryCov_9fa48("112"), () => handleChange(preset.hex))} aria-label={`${preset.name} (${preset.hex})`} sx={stryMutAct_9fa48("114") ? {} : (stryCov_9fa48("114"), {
              width: 32,
              height: 32,
              borderRadius: 0.5,
              border: '2px solid',
              borderColor: (stryMutAct_9fa48("118") ? color !== preset.hex : stryMutAct_9fa48("117") ? false : stryMutAct_9fa48("116") ? true : (stryCov_9fa48("116", "117", "118"), color === preset.hex)) ? 'primary.main' : 'rgba(255,255,255,0.2)',
              bgcolor: preset.hex,
              cursor: 'pointer',
              transition: 'all 0.15s',
              '&:hover': stryMutAct_9fa48("123") ? {} : (stryCov_9fa48("123"), {
                transform: 'scale(1.1)',
                borderColor: 'rgba(255,255,255,0.5)'
              }),
              '&:focus-visible': stryMutAct_9fa48("126") ? {} : (stryCov_9fa48("126"), {
                outline: 'none',
                borderColor: 'primary.main',
                boxShadow: '0 0 0 2px rgba(27, 169, 245, 0.4)'
              })
            })} />))}
          </Box>
        </Box>
      </Popover>
    </Box>;
  }
}