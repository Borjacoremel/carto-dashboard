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
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
interface SelectControlProps {
  label: string;
  value: string | null;
  options: {
    value: string;
    label: string;
  }[];
  onChange: (value: string | null) => void;
  placeholder?: string;
  allowNone?: boolean;
}
export function SelectControl({
  label,
  value,
  options,
  onChange,
  placeholder = 'Select...',
  allowNone = stryMutAct_9fa48("131") ? false : (stryCov_9fa48("131"), true)
}: SelectControlProps) {
  if (stryMutAct_9fa48("132")) {
    {}
  } else {
    stryCov_9fa48("132");
    return <Box>
      <Typography variant="caption" sx={stryMutAct_9fa48("133") ? {} : (stryCov_9fa48("133"), {
        mb: 0.75,
        display: 'block',
        color: 'text.secondary',
        fontWeight: 500,
        textTransform: 'uppercase',
        fontSize: '0.625rem',
        letterSpacing: '0.05em'
      })}>
        {label}
      </Typography>
      <FormControl fullWidth size="small">
        <Select value={stryMutAct_9fa48("141") ? value && 'none' : stryMutAct_9fa48("140") ? false : stryMutAct_9fa48("139") ? true : (stryCov_9fa48("139", "140", "141"), value || 'none')} onChange={stryMutAct_9fa48("143") ? () => undefined : (stryCov_9fa48("143"), e => onChange((stryMutAct_9fa48("146") ? e.target.value !== 'none' : stryMutAct_9fa48("145") ? false : stryMutAct_9fa48("144") ? true : (stryCov_9fa48("144", "145", "146"), e.target.value === 'none')) ? null : e.target.value))} displayEmpty sx={stryMutAct_9fa48("148") ? {} : (stryCov_9fa48("148"), {
          bgcolor: 'rgba(255,255,255,0.05)',
          '&:hover': stryMutAct_9fa48("150") ? {} : (stryCov_9fa48("150"), {
            bgcolor: 'rgba(255,255,255,0.1)'
          })
        })}>
          {stryMutAct_9fa48("154") ? allowNone || <MenuItem value="none">
              <Typography variant="body2" color="text.secondary">
                {placeholder}
              </Typography>
            </MenuItem> : stryMutAct_9fa48("153") ? false : stryMutAct_9fa48("152") ? true : (stryCov_9fa48("152", "153", "154"), allowNone && <MenuItem value="none">
              <Typography variant="body2" color="text.secondary">
                {placeholder}
              </Typography>
            </MenuItem>)}
          {options.map(stryMutAct_9fa48("155") ? () => undefined : (stryCov_9fa48("155"), opt => <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>))}
        </Select>
      </FormControl>
    </Box>;
  }
}