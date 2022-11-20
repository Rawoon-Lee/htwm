package a306.htwm.service;

import a306.htwm.dto.*;
import a306.htwm.entity.Exercise;
import a306.htwm.entity.Routine;
import a306.htwm.entity.Sets;
import a306.htwm.repository.ExerciseRepository;
import a306.htwm.repository.RoutineRepository;
import a306.htwm.repository.SetRepository;
import a306.htwm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional(readOnly = true) // 기본은 false
@RequiredArgsConstructor
public class RoutineService {

    private final UserRepository userRepository;
    private final ExerciseRepository exerciseRepository;
    private final RoutineRepository routineRepository;
    private final SetRepository setRepository;

    public ArrayList<ExerciseDTO> getExercise() {
        ArrayList<Exercise> exercises = exerciseRepository.findAll();
        ArrayList<ExerciseDTO> exerciseDTOS = new ArrayList<>();
        for(Exercise exercise : exercises){
            ExerciseDTO exerciseDTO = ExerciseDTO.builder()
                    .exercise_id(exercise.getId())
                    .name(exercise.getName())
                    .url(exercise.getUrl())
                    .build();
            exerciseDTOS.add(exerciseDTO);
        }
        return exerciseDTOS;
    }

    @Transactional
    public void create(CreateRoutineDTO createRoutineDTO){
        // 루틴 생성
        Routine routine = new Routine();
        if(routineRepository.findByNameAndUsername(createRoutineDTO.getName(), createRoutineDTO.getUsername()).isPresent()){
            throw new RuntimeException("중복된 루틴명입니다.");
        }
        routine.setName(createRoutineDTO.getName());
        routine.setColor(createRoutineDTO.getColor());
        routine.setUser(userRepository.findByUsername(createRoutineDTO.getUsername()));
        routineRepository.save(routine);

        // 세트 생성
        ArrayList<SetDTO> setDTOS = createRoutineDTO.getSets();
        for(SetDTO setDTO : setDTOS){
            if(exerciseRepository.findById(setDTO.getExercise_id()).isEmpty()) throw new RuntimeException("no such exercise id, start from 1");
            Sets set = new Sets();
            Long exerciseId = setDTO.getExercise_id();
//            if(exerciseId == 0f) set.setExercise(null); // 0 일때 휴식으로 예외 처리
//            else\
            set.setExercise(exerciseRepository.findById(exerciseId).get());
            set.setSet_cnt(setDTO.getSet_cnt());
            set.setNumber(setDTO.getNumber());
            set.setTime(setDTO.getSec());
            set.setRoutine(routine);
            setRepository.save(set);
        }
    }

    @Transactional
    public void delete(DeleteRoutineDTO deleteRoutineDTO){
        if(routineRepository.findByNameAndUsername(deleteRoutineDTO.getName(), deleteRoutineDTO.getUsername()).isEmpty()){
            throw new RuntimeException("루틴 명이 존재하지 않습니다.");
        }
        // 연관된 세트 삭제
        Routine routine = routineRepository.findByNameAndUsername(deleteRoutineDTO.getName(), deleteRoutineDTO.getUsername()).get();

        for(Sets set : setRepository.findAllByRoutine(routine.getId())){
            setRepository.delete(set);
        }

        // 해당 루팅 삭제
        routineRepository.delete(routine);
    }

    public ArrayList<RoutineDTO> getRoutine(String username) {
        ArrayList<Routine> routines = routineRepository.findAllByUsername(username);
        if(userRepository.findByUsername(username) == null) throw new RuntimeException("no such username");
        ArrayList<RoutineDTO> routineDTOS = new ArrayList<>();
        for(Routine routine : routines){
            List<Sets> sets = routine.getSets();
            ArrayList<SetDTO> setDTOS = new ArrayList<>();
            for(Sets set : sets){
                SetDTO setDTO = SetDTO.builder()
                        .sec(set.getTime())
                        .exercise_id(set.getExercise().getId())
                        .exercise_name(exerciseRepository.findById(set.getExercise().getId()).get().getName())
                        .number(set.getNumber())
                        .set_cnt(set.getSet_cnt())
                        .url(set.getExercise().getUrl())
                        .build();
                setDTOS.add(setDTO);
            }

            RoutineDTO routineDTO = RoutineDTO.builder()
                    .name(routine.getName())
                    .username(routine.getUser().getUsername())
                    .sets(setDTOS)
                    .color(routine.getColor())
                    .build();
            routineDTOS.add(routineDTO);
        }
        return routineDTOS;
    }
}
