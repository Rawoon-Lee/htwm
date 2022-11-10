package a306.htwm.controller;


import a306.htwm.dto.RecordRoutineDTO;
import a306.htwm.dto.UsernameAndDateDTO;
import a306.htwm.dto.UsernameDTO;
import a306.htwm.entity.User;
import a306.htwm.service.RecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<ArrayList<RecordRoutineDTO>> getRoutine(@RequestParam String username){
        try{
            return ResponseEntity.ok().body(recordService.getRoutine(username));
        }catch (RuntimeException e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/days")
    public ResponseEntity getDays(@RequestParam String username, @RequestParam String date) {
        try {
            return ResponseEntity.ok().body(recordService.count(username,date));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
