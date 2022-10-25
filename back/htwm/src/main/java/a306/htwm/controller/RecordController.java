package a306.htwm.controller;


import a306.htwm.dto.RecordRoutineDTO;
import a306.htwm.dto.UsernameDTO;
import a306.htwm.entity.User;
import a306.htwm.service.RecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
@RequestMapping("/record")
@RequiredArgsConstructor
public class RecordController {

    private final RecordService recordService;

    @PostMapping("/routine")
    public ResponseEntity recordRoutine(@RequestBody RecordRoutineDTO recordRoutineDTO){
        try{
            recordService.join(recordRoutineDTO);
        }catch (RuntimeException e){
            ResponseEntity.badRequest().body(e.getMessage());
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/routine")
    public ResponseEntity<ArrayList<RecordRoutineDTO>> getRoutine(@RequestParam UsernameDTO usernameDTO){
        ArrayList<RecordRoutineDTO> ret = new ArrayList<>();
        try{
            ret = recordService.getRoutine(usernameDTO.getUsername());
        }catch(RuntimeException e){
            ResponseEntity.badRequest().body(e.getMessage());
        }
        return ResponseEntity.ok().body(ret);
    }


}
