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
import { useState, useEffect, useCallback, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
  debounceMs?: number;
}
export function SliderControl({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  formatValue = stryMutAct_9fa48("156") ? () => undefined : (stryCov_9fa48("156"), v => v.toString()),
  debounceMs = 16
}: SliderControlProps) {
  if (stryMutAct_9fa48("157")) {
    {}
  } else {
    stryCov_9fa48("157");
    const [localValue, setLocalValue] = useState(value);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => {
      if (stryMutAct_9fa48("158")) {
        {}
      } else {
        stryCov_9fa48("158");
        setLocalValue(value);
      }
    }, stryMutAct_9fa48("159") ? [] : (stryCov_9fa48("159"), [value]));
    const handleChange = useCallback((newValue: number) => {
      if (stryMutAct_9fa48("160")) {
        {}
      } else {
        stryCov_9fa48("160");
        setLocalValue(newValue);
        if (stryMutAct_9fa48("162") ? false : stryMutAct_9fa48("161") ? true : (stryCov_9fa48("161", "162"), timeoutRef.current)) {
          if (stryMutAct_9fa48("163")) {
            {}
          } else {
            stryCov_9fa48("163");
            clearTimeout(timeoutRef.current);
          }
        }
        timeoutRef.current = setTimeout(() => {
          if (stryMutAct_9fa48("164")) {
            {}
          } else {
            stryCov_9fa48("164");
            onChange(newValue);
          }
        }, debounceMs);
      }
    }, stryMutAct_9fa48("165") ? [] : (stryCov_9fa48("165"), [onChange, debounceMs]));
    useEffect(() => {
      if (stryMutAct_9fa48("166")) {
        {}
      } else {
        stryCov_9fa48("166");
        return () => {
          if (stryMutAct_9fa48("167")) {
            {}
          } else {
            stryCov_9fa48("167");
            if (stryMutAct_9fa48("169") ? false : stryMutAct_9fa48("168") ? true : (stryCov_9fa48("168", "169"), timeoutRef.current)) {
              if (stryMutAct_9fa48("170")) {
                {}
              } else {
                stryCov_9fa48("170");
                clearTimeout(timeoutRef.current);
              }
            }
          }
        };
      }
    }, stryMutAct_9fa48("171") ? ["Stryker was here"] : (stryCov_9fa48("171"), []));
    return <Box>
      <Box sx={stryMutAct_9fa48("172") ? {} : (stryCov_9fa48("172"), {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 1
      })}>
        <Typography variant="caption" sx={stryMutAct_9fa48("176") ? {} : (stryCov_9fa48("176"), {
          color: 'text.secondary',
          fontWeight: 500,
          textTransform: 'uppercase',
          fontSize: '0.625rem',
          letterSpacing: '0.05em'
        })}>
          {label}
        </Typography>
        <Typography variant="body2" sx={stryMutAct_9fa48("181") ? {} : (stryCov_9fa48("181"), {
          fontFamily: 'monospace',
          color: 'primary.main',
          fontWeight: 500
        })}>
          {formatValue(localValue)}
        </Typography>
      </Box>
      <Slider value={localValue} min={min} max={max} step={step} onChange={stryMutAct_9fa48("184") ? () => undefined : (stryCov_9fa48("184"), (_, v) => handleChange(v as number))} size="small" />
    </Box>;
  }
}