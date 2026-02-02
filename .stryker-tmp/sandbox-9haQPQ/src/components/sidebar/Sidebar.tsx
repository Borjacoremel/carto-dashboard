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
import Layers from '@mui/icons-material/Layers';
import Info from '@mui/icons-material/Info';
import Place from '@mui/icons-material/Place';
import type { LayerConfig, LayerStyle } from '../../types/map';
import { LayerControls } from './LayerControls';
interface SidebarProps {
  layers: LayerConfig[];
  onStyleChange: (layerId: string, updates: Partial<LayerStyle>) => void;
  onToggleVisibility: (layerId: string) => void;
}
export function Sidebar({
  layers,
  onStyleChange,
  onToggleVisibility
}: SidebarProps) {
  if (stryMutAct_9fa48("279")) {
    {}
  } else {
    stryCov_9fa48("279");
    return <Box component="aside" sx={stryMutAct_9fa48("280") ? {} : (stryCov_9fa48("280"), {
      width: 320,
      bgcolor: 'background.paper',
      borderRight: '1px solid rgba(255,255,255,0.1)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    })}>
      {/* Header */}
      <Box sx={stryMutAct_9fa48("286") ? {} : (stryCov_9fa48("286"), {
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'divider'
      })}>
        <Box sx={stryMutAct_9fa48("289") ? {} : (stryCov_9fa48("289"), {
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 0.5
        })}>
          <Box sx={stryMutAct_9fa48("292") ? {} : (stryCov_9fa48("292"), {
            width: 32,
            height: 32,
            borderRadius: 1,
            bgcolor: 'primary.dark',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          })}>
            <Place sx={stryMutAct_9fa48("297") ? {} : (stryCov_9fa48("297"), {
              fontSize: 18,
              color: 'primary.main'
            })} />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={stryMutAct_9fa48("299") ? {} : (stryCov_9fa48("299"), {
              fontWeight: 600
            })}>
              CARTO Dashboard
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Layer Style Controls
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Data Source Info */}
      <Box sx={stryMutAct_9fa48("300") ? {} : (stryCov_9fa48("300"), {
        px: 2,
        py: 1.5,
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'action.hover'
      })}>
        <Typography variant="caption" color="text.secondary">
          <strong style={stryMutAct_9fa48("304") ? {} : (stryCov_9fa48("304"), {
            color: 'inherit'
          })}>Data Sources:</strong>
        </Typography>
        <Box component="ul" sx={stryMutAct_9fa48("306") ? {} : (stryCov_9fa48("306"), {
          mt: 0.5,
          pl: 2,
          mb: 0,
          fontSize: '0.75rem',
          color: 'text.secondary'
        })}>
          <li>retail_stores (BigQuery Table)</li>
          <li>sociodemographics_usa (Tileset)</li>
        </Box>
      </Box>

      {/* Scrollable Content */}
      <Box sx={stryMutAct_9fa48("309") ? {} : (stryCov_9fa48("309"), {
        flex: 1,
        overflow: 'auto',
        p: 2
      })}>
        {/* Layers Section */}
        <Box sx={stryMutAct_9fa48("311") ? {} : (stryCov_9fa48("311"), {
          mb: 2
        })}>
          <Box sx={stryMutAct_9fa48("312") ? {} : (stryCov_9fa48("312"), {
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 1.5
          })}>
            <Layers sx={stryMutAct_9fa48("315") ? {} : (stryCov_9fa48("315"), {
              fontSize: 18,
              color: 'text.secondary'
            })} />
            <Typography variant="caption" sx={stryMutAct_9fa48("317") ? {} : (stryCov_9fa48("317"), {
              color: 'text.secondary',
              fontWeight: 500,
              textTransform: 'uppercase',
              fontSize: '0.625rem',
              letterSpacing: '0.05em'
            })}>
              Layers
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ({stryMutAct_9fa48("322") ? layers.length : (stryCov_9fa48("322"), layers.filter(stryMutAct_9fa48("323") ? () => undefined : (stryCov_9fa48("323"), l => l.style.visible)).length)} visible)
            </Typography>
          </Box>

          <Box sx={stryMutAct_9fa48("324") ? {} : (stryCov_9fa48("324"), {
            '& > *:not(:last-child)': stryMutAct_9fa48("325") ? {} : (stryCov_9fa48("325"), {
              mb: 1
            })
          })}>
            {layers.map(stryMutAct_9fa48("326") ? () => undefined : (stryCov_9fa48("326"), layer => <LayerControls key={layer.id} layer={layer} onStyleChange={stryMutAct_9fa48("327") ? () => undefined : (stryCov_9fa48("327"), updates => onStyleChange(layer.id, updates))} onToggleVisibility={stryMutAct_9fa48("328") ? () => undefined : (stryCov_9fa48("328"), () => onToggleVisibility(layer.id))} />))}
          </Box>
        </Box>

        {/* Instructions */}
        <Box sx={stryMutAct_9fa48("329") ? {} : (stryCov_9fa48("329"), {
          p: 1.5,
          bgcolor: 'rgba(255,255,255,0.03)',
          borderRadius: 1
        })}>
          <Box sx={stryMutAct_9fa48("331") ? {} : (stryCov_9fa48("331"), {
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1
          })}>
            <Info sx={stryMutAct_9fa48("334") ? {} : (stryCov_9fa48("334"), {
              fontSize: 16,
              color: 'text.secondary',
              mt: 0.25
            })} />
            <Typography variant="caption" color="text.secondary">
              Hover over features on the map to see their attributes. Use the controls above to
              style each layer.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={stryMutAct_9fa48("336") ? {} : (stryCov_9fa48("336"), {
        p: 1.5,
        borderTop: '1px solid',
        borderColor: 'divider',
        textAlign: 'center'
      })}>
        <Typography variant="caption" color="text.secondary">
          Powered by CARTO + deck.gl
        </Typography>
      </Box>
    </Box>;
  }
}